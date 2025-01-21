import { Op } from 'sequelize'
import moment from 'moment-timezone'
import { db_main } from '../../config/db-config.js'
import { logEvent } from '../../helpers/logger-helper.js'
import { generatePdfTable } from '../../libs/pdfkitLib.js'
import { UserService } from '../../services/user-service.js'
import { GenericCrudModel } from '../../models/crud.model.js'
import { KEY_REDIS_USER } from '../../const/redisKey-const.js'
import { user_schema_zod } from '../validators/user-validator.js'
import { params_schema_zod } from '../validators/generic-validator.js'
import { sendResponse } from '../../helpers/responseHandler-helper.js'
import { getFromCache, setInCache } from '../../services/redis-service.js'
import { send_email_with_info_sigup } from '../../helpers/mailer-helper.js'
import { PAGINATION_LIMIT, PAGINATION_PAGE } from '../../const/pagination-const.js'
import { user_Schema, laboratory_analyst_Schema, system_config_Schema } from '../../schema/schemes.js'

export class UserController {
	constructor() {
		this.userService = new UserService()
	}

	getAllUsers = async (req, res) => {
		const { page = PAGINATION_PAGE, limit = PAGINATION_LIMIT, search = '' } = req?.query
		const cacheKey = `cache:${KEY_REDIS_USER}:page:${page}:limit:${limit}:search:${search}`

		try {
			const usersCache = await getFromCache(cacheKey)
			if (usersCache) return sendResponse(res, 200, 'Usuarios obtenidos exitosamente.', usersCache)

			const usersFound = await this.userService.getAllUsers(page, limit, search, req?.user?.id)
			await setInCache(cacheKey, usersFound)

			return sendResponse(res, 200, 'Usuarios obtenidos exitosamente.', usersFound)
		} catch (error) {
			await logEvent(
				'error',
				'Error al obtener los usuarios.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			return sendResponse(res, 500)
		}
	}

	getUserById = async (req, res) => {
		const cacheKey = `cache:${KEY_REDIS_USER}:${req?.params?.id}`

		try {
			const parsedData = params_schema_zod.safeParse(req?.params)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const cachedUser = await getFromCache(cacheKey)
			if (cachedUser) return sendResponse(res, 200, 'Usuario obtenido exitosamente.', cachedUser)

			const userFound = await this.userService.getUserById(req?.params?.id)
			if (!userFound) return sendResponse(res, 404, 'Usuario no encontrado.')

			await setInCache(cacheKey, userFound)

			return sendResponse(res, 200, 'Usuario obtenido exitosamente.', userFound)
		} catch (error) {
			await logEvent(
				'error',
				'Error al obtener el usuario.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			return sendResponse(res, 500)
		}
	}

	getMeUser = async (req, res) => {
		const cacheKey = `cache:${KEY_REDIS_USER}:${req?.user?.id}`

		try {
			const parsedData = params_schema_zod.safeParse(req?.user)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const cachedUser = await getFromCache(cacheKey)
			if (cachedUser) return sendResponse(res, 200, 'Usuario obtenido exitosamente.', cachedUser)

			const userFound = await this.userService.getUserById(req?.user?.id)
			if (!userFound) return sendResponse(res, 404, 'Usuario no encontrado.')

			await setInCache(cacheKey, userFound)

			return sendResponse(res, 200, 'Usuario obtenido exitosamente.', userFound)
		} catch (error) {
			await logEvent(
				'error',
				'Error al obtener el usuario.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			return sendResponse(res, 500)
		}
	}

	async createUser(req, res) {
		const t = await db_main.transaction()

		try {
			const parsedData = user_schema_zod.safeParse(req.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			await UserService.validateUniqueFields(
				[
					{ field: 'email', value: req.body.email, message: 'Ya existe un usuario con este correo.' },
					{ field: 'phone', value: req.body.phone, message: 'Ya existe un usuario con este teléfono.' },
					{
						field: 'identification_card',
						value: req.body.identification_card,
						message: 'Ya existe un usuario con este número de cédula.',
					},
				],
				t
			)

			const createUser = await UserService.createUser(req.body, t)
			await t.commit()

			await send_email_with_info_sigup(req.body.full_name, req.body.email, req.body.identification_card)

			await logEvent('info', 'Usuario creado exitosamente.', { createUser }, req?.user?.id, req)

			return sendResponse(res, 201, 'Usuario creado exitosamente.', createUser)
		} catch (error) {
			await logEvent(
				'error',
				'Error al obtener el usuario.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			await t.rollback()
			return sendResponse(res, 500)
		}
	}

	async updateUser(req, res) {
		const t = await db_main.transaction()

		try {
			const parsedData = user_schema_zod.safeParse(req?.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const user_found = await UserService.getUserById(req?.params?.id, t)
			if (!user_found) return sendResponse(res, 404, 'Usuario no encontrado.')

			await UserService.validateUniqueFields(
				[
					{ field: 'email', value: req?.body?.email, message: 'Ya existe un usuario con este correo.' },
					{ field: 'phone', value: req?.body?.phone, message: 'Ya existe un usuario con este teléfono.' },
					{
						field: 'identification_card',
						value: req?.body?.identification_card,
						message: 'Ya existe un usuario con este número de cédula.',
					},
				],
				req?.user?.id,
				t
			)

			const userData = { ...req?.body }
			const newUser = UserService.updateUser(req?.params?.id, userData, t)

			await t.commit()

			await logEvent('info', 'Usuario actualizado exitosamente.', { newUser }, req?.user?.id, req)
			return sendResponse(res, 200, 'Usuario actualizado exitosamente.')
		} catch (error) {
			await logEvent(
				'error',
				'Error al actualizar usuario.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			await t.rollback()
			return sendResponse(res, 500)
		}
	}

	async updatePassword(req, res) {
		const t = await db_main.transaction()

		try {
			const parsedData = user_password_schema.safeParse(req?.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			await UserService.updatePassword(
				req?.user?.id,
				req?.body?.currentPassword,
				req?.body?.newPassword,
				req?.body?.confirmPassword,
				t
			)

			await t.commit()
			await logEvent(
				'success',
				'Contraseña actualizada exitosamente.',
				{ data: req?.body?.newPassword },
				req?.user?.id,
				req
			)
			return sendResponse(res, 200, 'Contraseña actualizada exitosamente.')
		} catch (error) {
			await t.rollback()
			await logEvent(
				'error',
				'Error inesperado durante el cambio de contraseña',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			const statusCode =
				error.message === 'Usuario no encontrado.' ||
				error.message === 'Contraseña actual inválida.' ||
				error.message === 'La nueva contraseña no coincide.'
					? 400
					: 500
			return sendResponse(res, statusCode, error.message || 'Error interno del servidor.')
		}
	}

	async changeStatusUser(req, res) {
		try {
			const user_found = await user_Schema.findByPk(req.params.id)
			if (!user_found) return sendResponse(res, 404, 'Usuario no encontrado.')

			const userData = {
				active: !user_found.active,
			}

			await GenericCrudModel.updateRecord({
				keyRedis: KEY_REDIS_USER,
				model: user_Schema,
				data: userData,
				id_params: req.params.id,
				user_id: req.user.id,
				transaction_db_name: db_main,
				req,
				res,
				messageSuccess: 'Cambio de estado actualizado exitosamente.',
				messageNotFound: 'Usuario no encontrado.',
				messageError: 'Error al cambiar el estado del usuario.',
			})
		} catch (error) {
			console.log(error)
			sendResponse(res, 500)
		}
	}

	async deleteUser(req, res) {
		try {
			const userfound = await user_Schema.findByPk(req.params.id)
			if (!userfound) return sendResponse(res, 404, 'El usuario no fue encontrado.')

			const userIsLab = await laboratory_analyst_Schema.findOne({ where: { id_analyst_fk: userfound.id_user } })
			if (userIsLab)
				return sendResponse(res, 400, 'No se puede eliminar este usuario porque está asignado a un laboratorio.')

			await GenericCrudModel.deleteRecord({
				keyRedis: KEY_REDIS_USER,
				model: user_Schema,
				id_params: req.params.id,
				user_id: req.user.id,
				transaction_db_name: db_main,
				req,
				res,
				messageSuccess: 'Usuario eliminado exitosamente.',
				messageNotFound: 'Usuario no encontrado.',
				messageError: 'Hubo un error al intentar eliminar el usuario.',
			})
		} catch (error) {
			sendResponse(res, 500)
		}
	}

	async generatePdfReport(req, res) {
		try {
			const { startDate, endDate, timezone = 'America/Guayaquil' } = req.query

			const now = moment.tz(timezone)
			const startUTC = startDate
				? moment.tz(startDate, 'YYYY-MM-DD', timezone).startOf('day').utc().toDate()
				: now.clone().startOf('month').utc().toDate()
			const endUTC = endDate
				? moment.tz(endDate, 'YYYY-MM-DD', timezone).endOf('day').utc().toDate()
				: now.clone().endOf('month').utc().toDate()

			const usersFound = await user_Schema.findAll({
				where: {
					createdAt: {
						[Op.gte]: startUTC,
						[Op.lte]: endUTC,
					},
				},
				order: [['createdAt', 'ASC']],
			})

			if (!usersFound.length) return sendResponse(res, 404, 'No se encontraron usuarios para generar el reporte.')

			const title_rows = ['Nombres', 'Email', 'Teléfono', 'Cédula', 'Código', 'Estado']
			const rows = usersFound.map(item => [
				item?.full_name || '',
				item?.email || '',
				item?.phone || '',
				item?.identification_card || '',
				item?.code || '',
				item?.active ? 'Habilitado' : 'Deshabilitado',
			])

			const totalRows = usersFound.length

			const infoU = await system_config_Schema.findOne()
			const institutionData = {
				name: infoU.institution_name,
				address: infoU.address,
				contact: `${infoU.contact_phone} | ${infoU.contact_email}`,
			}

			await logEvent('info', 'Se generó un reporte PDF de usuarios.', null, req.user.id, req)

			const formatDate = date => (date ? moment(date).tz(timezone).format('DD-MM-YYYY') : 'No especificado')

			const pdfFilename = `Reporte_Usuarios_${moment().tz(timezone).format('YYYY-MM-DD_HH-mm')}.pdf`
			await generatePdfTable(
				{
					institutionData,
					title: 'Reporte de usuarios.',
					header: {
						dateRange: `Fecha de reporte: ${formatDate(startUTC)} - ${formatDate(endUTC)}`,
						totalRows: `Total de registros: ${totalRows}`,
					},
					title_rows,
					rows,
					filename: pdfFilename,
				},
				res
			)
		} catch (error) {
			await logEvent(
				'error',
				'Error al generar el reporte PDF de usuarios.',
				{ error: error.message, stack: error.stack },
				req.user.id,
				req
			)
			return sendResponse(res, 500)
		}
	}
}
