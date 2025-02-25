import { db_main } from '../../../config/db-config.js'
import { logEvent } from '../../../shared/helpers/logger-helper.js'
import { AccessLabService } from '../application/services/AcesslabService.js'
import { sendResponse } from '../../../shared/helpers/responseHandler-helper.js'
import { PAGINATION_LIMIT, PAGINATION_PAGE } from '../../../shared/constants/pagination-const.js'
import { accessLab_schema_zod, accessLab_status_schema_zod, params_schema_zod } from '../validators/accesslabSchema.js'
import {
	rol_Schema,
	system_config_Schema,
	user_role_main_Schema,
	user_roles_Schema,
	user_Schema,
} from '../../../schema/schemes.js'
import { ROLES } from '../../../shared/constants/roles-const.js'
import { Op } from 'sequelize'
import { sendMailRequestAccess } from '../services/node-mailer.js'

export class AccessLabController {
	static async getAll(req, res) {
		const { page = PAGINATION_PAGE, limit = PAGINATION_LIMIT, search = '' } = req?.query

		try {
			const dataFound = await AccessLabService.getAll(page, limit, search)
			return sendResponse(res, 200, 'Accesos obtenidos exitosamente.', dataFound)
		} catch (error) {
			await logEvent(
				'error',
				'Error al obtener los accesos.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			return sendResponse(res, 500, '¡Oops! Error al obtener accesos.')
		}
	}

	static async getAllPertainLab(req, res) {
		const { page = PAGINATION_PAGE, limit = PAGINATION_LIMIT, search = '' } = req?.query

		try {
			const dataFound = await AccessLabService.getAllPertainLab(req.params.id, page, limit, search)
			return sendResponse(res, 200, 'Accesos del laboratorio obtenidos exitosamente.', dataFound)
		} catch (error) {
			await logEvent(
				'error',
				'Error al obtener los accesos del laboratorio.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			return sendResponse(res, 500, '¡Oops! Error al obtener accesos.')
		}
	}

	static async getAllPertainToAnalyst(req, res) {
		const { page = PAGINATION_PAGE, limit = PAGINATION_LIMIT, search = '' } = req?.query

		try {
			const dataFound = await AccessLabService.getAllPertainToAnalyst(req.user.id, page, limit, search)
			return sendResponse(res, 200, 'Accesos a laboratorios obtenidos exitosamente.', dataFound)
		} catch (error) {
			await logEvent(
				'error',
				'Error al obtener los accesos a laboratorios.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			return sendResponse(res, 500, '¡Oops! Error al obtener accesos.')
		}
	}

	static async getById(req, res) {
		try {
			const parsedData = params_schema_zod.safeParse(req?.params)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const dataFound = await AccessLabService.getById(req.params.id)
			if (!dataFound) return sendResponse(res, 404, 'Acceso a laboratorio no econtrado.')

			return sendResponse(res, 200, 'Acceso a laboratorio obtenido exitosamente.', dataFound)
		} catch (error) {
			await logEvent(
				'error',
				'Error al obtener el acceso al laboratorio.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			return sendResponse(res, 500)
		}
	}

	static async getByCode(req, res) {
		try {
			const dataFound = await AccessLabService.getByCode(req.params.code)
			if (dataFound.error) return sendResponse(res, dataFound.code, dataFound.error)
			return sendResponse(res, 200, 'Acceso a laboratorio obtenido exitosamente.', dataFound)
		} catch (error) {
			await logEvent(
				'error',
				'Error al obtener el acceso al laboratorio.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			return sendResponse(res, 500)
		}
	}

	static async create(req, res) {
		const t = await db_main.transaction()

		try {
			const parsedData = accessLab_schema_zod.safeParse(req.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			// Crear el acceso y obtener la data (newData)
			const newData = await AccessLabService.create(req.body, t)
			if (newData.error) return sendResponse(res, newData.code, newData.error)

			// 1. Obtener el rol director
			const findRoleDirector = await rol_Schema.findOne({
				where: { type_rol: ROLES.DIRECTOR },
			})

			// 2. Buscar en user_roles_Schema usando el id del rol
			const userRoles = await user_roles_Schema.findAll({
				where: { id_rol_fk: findRoleDirector.id_rol },
			})

			// 3. Extraer los id_user_role_intermediate_fk de los resultados
			const intermediateIds = userRoles.map(role => role.id_user_role_intermediate_fk)

			// 4. Buscar en user_role_main_Schema usando los intermediateIds
			const userIntermediate = await user_role_main_Schema.findAll({
				where: { id_user_role_intermediate: { [Op.in]: intermediateIds } },
			})

			// 5. Extraer los id_user_fk de los resultados anteriores
			const userIds = userIntermediate.map(inter => inter.id_user_fk)

			// 6. Finalmente, obtener los datos de los usuarios en user_Schema
			const directorUsers = await user_Schema.findAll({
				where: { id_user: { [Op.in]: userIds } },
			})

			// Enviar el correo a cada director.
			// Se usa Promise.all para esperar a que se envíen todos los correos.
			await Promise.all(directorUsers.map(user => sendMailRequestAccess(newData, user)))

			await t.commit()

			await logEvent('info', 'Acceso creado exitosamente.', { data: newData }, req?.user?.id, req)
			return sendResponse(res, 201, 'Acceso creado exitosamente.', newData)
		} catch (error) {
			await logEvent(
				'error',
				'Error al crear el acceso.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			await t.rollback()
			return sendResponse(res, 500)
		}
	}

	static async update(req, res) {
		const t = await db_main.transaction()

		try {
			const parsedParams = params_schema_zod.safeParse(req.params)
			if (!parsedParams.success) return sendResponse(res, 400, parsedParams.error.errors[0].message)

			const parsedData = accessLab_schema_zod.safeParse(req.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const labFound = await AccessLabService.getById(req?.params?.id)
			if (!labFound) return sendResponse(res, 404, 'Acceso no encontrado.')

			const labData = await AccessLabService.update(req?.params?.id, req.body, t)

			await t.commit()

			await logEvent('info', 'Acceso actualizado exitosamente.', { labData }, req?.user?.id, req)
			return sendResponse(res, 200, 'Acceso actualizado exitosamente.')
		} catch (error) {
			console.log(error)
			await logEvent(
				'error',
				'Error al actualizar acceso.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			await t.rollback()
			return sendResponse(res, 500)
		}
	}

	static async changeStatus(req, res) {
		const t = await db_main.transaction()

		try {
			const parsedParams = params_schema_zod.safeParse(req.params)
			if (!parsedParams.success) return sendResponse(res, 400, parsedParams.error.errors[0].message)

			const parsedData = accessLab_status_schema_zod.safeParse(req.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const labFound = await AccessLabService.getById(req?.params?.id)
			if (!labFound) return sendResponse(res, 404, 'Acceso no encontrado.')

			const labData = await AccessLabService.chageStatus(req?.params?.id, req.body, t)

			await t.commit()

			await logEvent('info', 'Acceso actualizado exitosamente.', { labData }, req?.user?.id, req)
			return sendResponse(res, 200, 'Acceso actualizado exitosamente.')
		} catch (error) {
			await logEvent(
				'error',
				'Error al actualizar acceso.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			await t.rollback()
			return sendResponse(res, 500)
		}
	}

	static async delete(req, res) {
		const t = await db_main.transaction()

		try {
			const parsedParams = params_schema_zod.safeParse(req?.params)
			if (!parsedParams.success) return sendResponse(res, 400, parsedParams.error.errors[0].message)

			const userFound = await AccessLabService.getById(req?.params?.id)
			if (!userFound) return sendResponse(res, 404, 'Acceso no encontrado.')

			const labData = await AccessLabService.delete(req?.params?.id, t)

			await t.commit()

			await logEvent('info', 'Acceso eliminado exitosamente.', { labData }, req?.user?.id, req)
			return sendResponse(res, 200, 'Acceso eliminado exitosamente.')
		} catch (error) {
			await logEvent(
				'error',
				'Error al eliminar el acceso.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			await t.rollback()
			return sendResponse(res, 500)
		}
	}

	static async restore(req, res) {
		const t = await db_main.transaction()

		try {
			const parsedParams = params_schema_zod.safeParse(req?.params)
			if (!parsedParams.success) return sendResponse(res, 400, parsedParams.error.errors[0].message)

			const userFound = await AccessLabService.getById(req?.params?.id)
			if (!userFound) return sendResponse(res, 404, 'Acceso no encontrado.')

			const labData = await AccessLabService.restore(req?.params?.id, t)

			await t.commit()

			await logEvent('info', 'Acceso restaurado exitosamente.', { labData }, req?.user?.id, req)
			return sendResponse(res, 200, 'Acceso restaurado exitosamente.')
		} catch (error) {
			await logEvent(
				'error',
				'Error al restaurar acceso.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			await t.rollback()
			return sendResponse(res, 500)
		}
	}

	static async deletePermanent(req, res) {
		const t = await db_main.transaction()

		try {
			const parsedParams = params_schema_zod.safeParse(req?.params)
			if (!parsedParams.success) return sendResponse(res, 400, parsedParams.error.errors[0].message)

			const userFound = await AccessLabService.getById(req?.params?.id)
			if (!userFound) return sendResponse(res, 404, 'Acceso no encontrado.')

			const labData = await AccessLabService.deletePermanent(req?.params?.id, t)

			await t.commit()

			await logEvent('info', 'Acceso eliminado permanentemente.', { labData }, req?.user?.id, req)
			return sendResponse(res, 200, 'Acceso eliminado permanentemente.')
		} catch (error) {
			await logEvent(
				'error',
				'Error al eliminar el acceso.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			await t.rollback()
			return sendResponse(res, 500)
		}
	}
}
