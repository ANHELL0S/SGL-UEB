import { signInSchemaZod } from '../../validators/signInSchema.js'
import { logEvent } from '../../../../shared/helpers/logger-helper.js'
import { SignInService } from '../../application/services/SignInService.js'
import { sendResponse } from '../../../../shared/helpers/responseHandler-helper.js'
import { meta_data_Schema, token_Schema, user_Schema } from '../../../../schema/schemes.js'
import { UAParser } from 'ua-parser-js'
import jwt from 'jsonwebtoken'
import { env } from '../../../../config/env-config.js'
import { sendCodeResetPassword } from '../../../../shared/helpers/mailer-helper.js'
import { db_main } from '../../../../config/db-config.js'
import { reset_password_schema } from '../../validators/resetPasswordSchema.js'
import { isTokenExpired } from '../../../../shared/helpers/jwt-helper.js'
import bcrypt from 'bcrypt'

export class AuthController {
	static async signIn(req, res) {
		try {
			const parsedData = signInSchemaZod.safeParse(req.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const authUser = await SignInService.signIn(req.body.email, req.body.password, res, req)
			if (authUser.error) return sendResponse(res, authUser.code, authUser.error)

			const parser = new UAParser()
			const userAgent = req.headers['user-agent'] || 'Desconocido'
			const ua = parser.setUA(userAgent).getResult()

			const referer = req.headers['referer'] || 'Sin Referer'
			const ip = req.ip === '::1' ? '127.0.0.1' : req.ip

			const browser = ua.browser
			const os = ua.os
			const device = ua.device

			// Guardar la información en la base de datos
			await meta_data_Schema.create({
				ip,
				userAgent,
				browser: `${browser.name} ${browser.version}`,
				os: `${os.name} ${os.version}`,
				device: `${os.type} ${os.model}` || 'Desconocido',
			})

			// Registrar el evento de inicio de sesión exitoso
			await logEvent(
				'info',
				'Inicio de sesión exitoso.',
				{ authUser, ip, userAgent, browser, os, device, referer },
				req?.user?.id,
				req
			)

			return sendResponse(res, 200, 'Inicio de sesión exitoso.', authUser)
		} catch (error) {
			await logEvent(
				'error',
				'Error al iniciar sesión.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)

			return sendResponse(res, 500)
		}
	}

	static async logout(req, res) {
		try {
			res.clearCookie('accessToken', { path: '/' })
			res.clearCookie('refreshToken', { path: '/' })

			const accessToken = req.cookies?.accessToken
			if (accessToken) await token_Schema.update({ expired: true }, { where: { token: accessToken } })

			await logEvent('info', 'Sesion cerrada exitosamente', { id: req.user.id }, req.user.id, req)
			return sendResponse(res, 200, 'Sesión cerrada exitosamente.')
		} catch (error) {
			await logEvent(
				'error',
				'Error durante el cierre de sesión',
				{ error: error.message, stack: error.stack },
				null,
				req
			)
			return sendResponse(res, 500)
		}
	}

	static async refreshToken(req, res) {}

	static async requestPasswordReset(req, res) {
		try {
			const { email } = req.body

			if (!email) return sendResponse(res, 401, 'Por favor, ingresa tu email actual.')

			const findUser = await user_Schema.findOne({ where: { email } })
			if (!findUser) return sendResponse(res, 404, 'Email no encontrado.')

			const token = jwt.sign({ id: findUser.id_user }, env.JWT_SECRET, { expiresIn: '5m' })

			const parser = new UAParser()
			const userAgent = req.headers['user-agent'] || 'Desconocido'
			const ua = parser.setUA(userAgent).getResult()
			const ip = req.ip === '::1' ? '127.0.0.1' : req.ip

			const browser = ua.browser
			const os = ua.os

			await meta_data_Schema.create({
				token: token,
				ip,
				userAgent,
				browser: `${browser.name} ${browser.version}`,
				os: `${os.name} ${os.version}`,
				device: `${os.type} ${os.model}` || 'Desconocido',
			})

			await token_Schema.create({
				id_user_fk: findUser?.id_user,
				token: token,
			})

			const send_link = await sendCodeResetPassword(email, token)

			await logEvent(
				'info',
				'Enlace de recuperación enviado exitosamente.',
				{ link: send_link, token: token },
				req?.user?.id_user,
				req
			)
			sendResponse(res, 200, 'Enlace de recuperación enviado exitosamente.', { link: send_link, token: token })
		} catch (error) {
			await logEvent(
				'error',
				'Error en la solicitud de restablecimiento de contraseña',
				{ error: error.message, stack: error.stack },
				null,
				req
			)
			return sendResponse(res, 500)
		}
	}

	static async resetPassword(req, res) {
		const t = await db_main.transaction()
		try {
			const parsedData = reset_password_schema.safeParse(req.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const { token } = req.body
			const { id } = req.params

			if (isTokenExpired(token)) return sendResponse(res, 401, 'El código OTP ha expirado.')

			const decoded = jwt.verify(token, env.JWT_SECRET)
			if (decoded.id !== id) return sendResponse(res, 403, 'No autorizado para realizar esta acción.')

			const user = await user_Schema.findByPk(id, { transaction: t })
			if (!user) return sendResponse(res, 404, 'Usuario no encontrado.')

			const hashedPassword = await bcrypt.hash(req.body.newPassword, 10)

			const userData = {
				password: hashedPassword,
			}

			await user_Schema.update(userData, {
				where: { id_user: id },
				transaction: t,
			})

			await token_Schema.update(
				{ used: true },
				{
					where: { token: token },
					transaction: t,
				}
			)

			await logEvent('info', 'Contraseña restablecida correctamente.', null, id, req)
			await t.commit()
			return sendResponse(res, 200, 'Contraseña restablecida correctamente.')
		} catch (error) {
			console.log(error)
			await logEvent(
				'error',
				'Error al restablecer la contraseña',
				{ error: error.message, stack: error.stack },
				null,
				req
			)
			await t.rollback()
			return sendResponse(res, 500)
		}
	}
}
