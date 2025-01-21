import { signInSchemaZod } from '../../validators/signInSchema.js'
import { logEvent } from '../../../../shared/helpers/logger-helper.js'
import { SignInService } from '../../application/services/SignInService.js'
import { sendResponse } from '../../../../shared/helpers/responseHandler-helper.js'

export class AuthController {
	static async signIn(req, res) {
		try {
			const parsedData = signInSchemaZod.safeParse(req.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const authUser = await SignInService.signIn(req.body.email, req.body.password, res)
			if (authUser.error) return sendResponse(res, 401, authUser.error)

			await logEvent('info', 'Inicio de sesión exitosamente.', { authUser }, req?.user?.id, req)
			return sendResponse(res, 200, 'Inicio de sesión exitoso.', authUser)
		} catch (error) {
			await logEvent(
				'error',
				'Error al crear el usuario.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			return sendResponse(res, 500)
		}
	}

	logout = async (req, res) => {
		try {
			res.clearCookie('accessToken', { path: '/' })
			res.clearCookie('refreshToken', { path: '/' })
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
}
