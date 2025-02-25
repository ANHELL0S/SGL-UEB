import { Op } from 'sequelize'
import moment from 'moment-timezone'
import { db_main } from '../../../../config/db-config.js'
import { logEvent } from '../../../../shared/helpers/logger-helper.js'
import { generatePdfTable } from '../../../../shared/libs/pdfkitLib.js'
import { UserService } from '../../application/services/userService.js'
import { RedisCache } from '../../../../shared/services/redis-service.js'
import { REDIS_KEYS } from '../../../../shared/constants/redisKey-const.js'
import { user_Schema, system_config_Schema } from '../../../../schema/schemes.js'
import { sendResponse } from '../../../../shared/helpers/responseHandler-helper.js'
import { send_email_with_info_sigup } from '../../../../shared/helpers/mailer-helper.js'
import { PAGINATION_LIMIT, PAGINATION_PAGE } from '../../../../shared/constants/pagination-const.js'
import {
	manager_user_roles_zod,
	params_schema_zod,
	user_schema_zod,
	user_status_schema_zod,
} from '../../validators/userSchema.js'

export class UserController {
	static async getAllUsers(req, res) {
		const { page = PAGINATION_PAGE, limit = PAGINATION_LIMIT, search = '' } = req?.query
		const cacheKey = `cache:${REDIS_KEYS.USERS.USER}:page:${page}:limit:${limit}:search:${search}`

		try {
			const usersCache = await RedisCache.getFromCache(cacheKey)
			if (usersCache) return sendResponse(res, 200, 'Usuarios obtenidos exitosamente.', usersCache)

			const dataFound = await UserService.getAllUsers(page, limit, search, req?.user?.id)
			await RedisCache.setInCache(cacheKey, dataFound)

			return sendResponse(res, 200, 'Usuarios obtenidos exitosamente.', dataFound)
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

	static async getUserById(req, res) {
		const cacheKey = `cache:${REDIS_KEYS.USERS.USER}:${req?.params?.id}`

		try {
			const parsedData = params_schema_zod.safeParse(req?.params)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const cachedUser = await RedisCache.getFromCache(cacheKey)
			if (cachedUser) return sendResponse(res, 200, 'Usuario obtenido exitosamente.', cachedUser)

			const userFound = await UserService.getUserById(req?.params?.id)
			if (!userFound) return sendResponse(res, 404, 'Usuario no encontrado.')

			await RedisCache.setInCache(cacheKey, userFound)

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

	static async getMeUser(req, res) {
		const cacheKey = `cache:${REDIS_KEYS.USERS.USER}:${req?.user?.id}`

		try {
			const parsedData = params_schema_zod.safeParse(req?.user)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const cachedUser = await RedisCache.getFromCache(cacheKey)
			if (cachedUser) return sendResponse(res, 200, 'Usuario de sesión obtenido exitosamente.', cachedUser)

			const userFound = await UserService.getUserById(req?.user?.id)
			if (!userFound) return sendResponse(res, 404, 'Usuario de de sesión no encontrado.')

			await RedisCache.setInCache(cacheKey, userFound)

			return sendResponse(res, 200, 'Usuario de sesión obtenido exitosamente.', userFound)
		} catch (error) {
			await logEvent(
				'error',
				'Error al obtener el usuario de sesión.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			return sendResponse(res, 500)
		}
	}

	static async createUser(req, res) {
		const t = await db_main.transaction()
		const cacheKey = `cache:${REDIS_KEYS.USERS.USER}:*`

		try {
			const parsedData = user_schema_zod.safeParse(req.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const userData = await UserService.createUser(req.body, t)
			if (userData.error) return sendResponse(res, userData.code, userData.error)

			await RedisCache.clearCache(cacheKey)
			await t.commit()

			await send_email_with_info_sigup(req.body.names, req.body.email, req.body.dni, req.body.code)

			await logEvent('info', 'Usuario creado exitosamente.', { data: userData.user }, req?.user?.id, req)
			return sendResponse(res, 201, 'Usuario creado exitosamente.', userData.user)
		} catch (error) {
			await logEvent(
				'error',
				'Error al crear el usuario.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			await t.rollback()
			return sendResponse(res, 500)
		}
	}

	static async managerUserRoles(req, res) {
		const t = await db_main.transaction()
		const cacheUserKey = `cache:${REDIS_KEYS.USERS.USER}:*`

		try {
			const parsedData = manager_user_roles_zod.safeParse(req.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const userData = await UserService.managerUserRoles(req.body, t)
			if (userData.error) return sendResponse(res, userData.status, userData.error)

			await RedisCache.clearCache(cacheUserKey)
			await t.commit()

			await logEvent('info', 'Roles del usuario asignados exitosamente.', { data: userData.user }, req?.user?.id, req)
			return sendResponse(res, 201, 'Roles del usuario asignados exitosamente.', userData.user)
		} catch (error) {
			console.log(error)
			await logEvent(
				'error',
				'Error al asignar roles del usuario.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			await t.rollback()
			return sendResponse(res, 500)
		}
	}

	static async updateUser(req, res) {
		const t = await db_main.transaction()
		const cacheKey = `cache:${REDIS_KEYS.USERS.USER}:*`

		try {
			const parsedParams = params_schema_zod.safeParse(req?.params)
			if (!parsedParams.success) return sendResponse(res, 400, parsedParams.error.errors[0].message)

			const parsedData = user_schema_zod.safeParse(req?.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const userFound = await UserService.getUserById(req?.params?.id)
			if (!userFound) return sendResponse(res, 404, 'Usuario no encontrado.')

			const userData = await UserService.updateUser(req?.params?.id, req.body, t)
			if (userData.error) return sendResponse(res, 400, userData.error)

			await RedisCache.clearCache(cacheKey)
			await t.commit()

			await logEvent('info', 'Usuario actualizado exitosamente.', { userData }, req?.user?.id, req)
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

	static async changeStatusUser(req, res) {
		const t = await db_main.transaction()
		const cacheKey = `cache:${REDIS_KEYS.USERS.USER}:*`

		try {
			const parsedParams = params_schema_zod.safeParse(req?.params)
			if (!parsedParams.success) return sendResponse(res, 400, parsedParams.error.errors[0].message)

			const parsedData = user_status_schema_zod.safeParse(req?.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const userFound = await UserService.getUserById(req?.params?.id)
			if (!userFound) return sendResponse(res, 404, 'Usuario no encontrado.')

			const userData = await UserService.changeStatusUser(req?.params?.id, req.body, t)

			await RedisCache.clearCache(cacheKey)
			await t.commit()

			await logEvent('info', 'Estado de usuario actualizado exitosamente.', { userData }, req?.user?.id, req)
			return sendResponse(res, 200, 'Estado de usuario actualizado exitosamente.')
		} catch (error) {
			await logEvent(
				'error',
				'Error al actualizar el estado del usuario.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			await t.rollback()
			return sendResponse(res, 500)
		}
	}

	static async deleteUser(req, res) {
		const t = await db_main.transaction()
		const cacheKey = `cache:${REDIS_KEYS.USERS.USER}:*`

		try {
			const parsedParams = params_schema_zod.safeParse(req?.params)
			if (!parsedParams.success) return sendResponse(res, 400, parsedParams.error.errors[0].message)

			const userFound = await UserService.getUserById(req?.params?.id)
			if (!userFound) return sendResponse(res, 404, 'Usuario no encontrado.')

			const userData = await UserService.deleteUser(req?.params?.id, t)
			if (userData?.error) return sendResponse(res, 400, userData.error)

			await RedisCache.clearCache(cacheKey)
			await t.commit()

			await logEvent('info', 'Usuario eliminado exitosamente.', { userData }, req?.user?.id, req)
			return sendResponse(res, 200, 'Usuario eliminado exitosamente.')
		} catch (error) {
			await logEvent(
				'error',
				'Error al eliminar el estado del usuario.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			await t.rollback()
			return sendResponse(res, 500)
		}
	}

	static async restoreUser(req, res) {
		const t = await db_main.transaction()
		const cacheKey = `cache:${REDIS_KEYS.USERS.USER}:*`

		try {
			const parsedParams = params_schema_zod.safeParse(req?.params)
			if (!parsedParams.success) return sendResponse(res, 400, parsedParams.error.errors[0].message)

			const userFound = await UserService.getUserById(req?.params?.id)
			if (!userFound) return sendResponse(res, 404, 'Usuario no encontrado.')

			const userData = await UserService.restoreUser(req?.params?.id, t)
			await RedisCache.clearCache(cacheKey)

			await t.commit()

			await logEvent('info', 'Usuario restaurado exitosamente.', { userData }, req?.user?.id, req)
			return sendResponse(res, 200, 'Usuario restaurado exitosamente.')
		} catch (error) {
			await logEvent(
				'error',
				'Error al restaurar usuario.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			await t.rollback()
			return sendResponse(res, 500)
		}
	}

	static async deletePermanentUser(req, res) {
		const t = await db_main.transaction()
		const cacheKey = `cache:${REDIS_KEYS.USERS.USER}:*`

		try {
			const parsedParams = params_schema_zod.safeParse(req?.params)
			if (!parsedParams.success) return sendResponse(res, 400, parsedParams.error.errors[0].message)

			const userFound = await UserService.getUserById(req?.params?.id)
			if (!userFound) return sendResponse(res, 404, 'Usuario no encontrado.')

			const userData = await UserService.deletePermanentUser(req?.params?.id, t)
			if (userData?.error) return sendResponse(res, 400, userData.error)

			await RedisCache.clearCache(cacheKey)
			await t.commit()

			await logEvent('info', 'Usuario eliminado permanentemente.', { userData }, req?.user?.id, req)
			return sendResponse(res, 200, 'Usuario eliminado permanentemente.')
		} catch (error) {
			await logEvent(
				'error',
				'Error al eliminar permanentemente el usuario.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			await t.rollback()
			return sendResponse(res, 500)
		}
	}

	static async generatePdfReport(req, res) {
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
				order: [['createdAt', 'DESC']],
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
				contact: `${infoU.contact_phone}`,
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
