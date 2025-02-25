import {
	params_schema_zod,
	experiment_schema_zod,
	experiment_status_schema_zod,
} from '../validators/experimentSchema.js'
import { db_main } from '../../../config/db-config.js'
import { logEvent } from '../../../shared/helpers/logger-helper.js'
import { RedisCache } from '../../../shared/services/redis-service.js'
import { REDIS_KEYS } from '../../../shared/constants/redisKey-const.js'
import { ParameterService } from '../application/services/ParameterService.js'
import { sendResponse } from '../../../shared/helpers/responseHandler-helper.js'
import { PAGINATION_LIMIT, PAGINATION_PAGE } from '../../../shared/constants/pagination-const.js'

export class ParameterController {
	static async getAll(req, res) {
		const { page = PAGINATION_PAGE, limit = PAGINATION_LIMIT, search = '' } = req?.query

		try {
			const dataFound = await ParameterService.getAll(page, limit, search)
			return sendResponse(res, 200, 'Parametros obtenidos exitosamente.', dataFound)
		} catch (error) {
			await logEvent(
				'error',
				'Error al obtener los parametros.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			return sendResponse(res, 500)
		}
	}

	static async getAllToAcess(req, res) {
		try {
			const dataFound = await ParameterService.getAllToAccess(req.params.id)
			return sendResponse(res, 200, 'Experimentos obtenidos exitosamente.', dataFound)
		} catch (error) {
			await logEvent(
				'error',
				'Error al obtener los experimentos.',
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
			const parsedData = experiment_schema_zod.safeParse(req.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const newData = await ParameterService.create(req.body, t)
			if (newData.error) return sendResponse(res, 400, newData.error)

			await t.commit()

			await logEvent('info', 'Experimento creado exitosamente.', { newData }, req?.user?.id, req)
			return sendResponse(res, 201, 'Experimento creado exitosamente.')
		} catch (error) {
			await logEvent(
				'error',
				'Error al crear el experimento.',
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

			const parsedData = experiment_schema_zod.safeParse(req.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const experiment = await ParameterService.getById(req?.params?.id)
			if (!experiment) return sendResponse(res, 404, 'Experimento no encontrado.')

			const experimentUpdated = await ParameterService.update(req?.params?.id, req.body, t)

			await t.commit()

			await logEvent('info', 'Experimento actualizado exitosamente.', { experimentUpdated }, req?.user?.id, req)
			return sendResponse(res, 200, 'Experimento actualizado exitosamente.')
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

	static async changeStatus(req, res) {
		const t = await db_main.transaction()

		try {
			const parsedParams = params_schema_zod.safeParse(req?.params)
			if (!parsedParams.success) return sendResponse(res, 400, parsedParams.error.errors[0].message)

			const parsedData = experiment_status_schema_zod.safeParse(req?.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const experiment = await ParameterService.getById(req?.params?.id)
			if (!experiment) return sendResponse(res, 404, 'Experimento no encontrado.')

			const experimentUpdated = await ParameterService.changeStatus(req?.params?.id, req.body, t)

			await t.commit()

			await logEvent(
				'info',
				'Estado de experimento actualizado exitosamente.',
				{ experimentUpdated },
				req?.user?.id,
				req
			)
			return sendResponse(res, 200, 'Estado de experimento actualizado exitosamente.')
		} catch (error) {
			await logEvent(
				'error',
				'Error al actualizar el estado del experimento.',
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

			const experiment = await ParameterService.getById(req?.params?.id)
			if (!experiment) return sendResponse(res, 404, 'Experimento no encontrado.')

			await ParameterService.delete(req?.params?.id, t)

			await t.commit()

			await logEvent('info', 'Experimento eliminado exitosamente.', { experiment }, req?.user?.id, req)
			return sendResponse(res, 200, 'Experimento eliminado exitosamente.')
		} catch (error) {
			await logEvent(
				'error',
				'Error al eliminar el experimento.',
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

			const experiment = await ParameterService.getById(req?.params?.id)
			if (!experiment) return sendResponse(res, 404, 'Experimento no encontrado.')

			await ParameterService.restore(req?.params?.id, t)

			await t.commit()

			await logEvent('info', 'Parametro restaurado permanentemente.', { experiment }, req?.user?.id, req)
			return sendResponse(res, 200, 'Parametro restaurado permanentemente.')
		} catch (error) {
			await logEvent(
				'error',
				'Error al restaurar el parametro.',
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

			const experiment = await ParameterService.getById(req?.params?.id)
			if (!experiment) return sendResponse(res, 404, 'Experimento no encontrado.')

			await ParameterService.deletePermanent(req?.params?.id, t)

			await t.commit()

			await logEvent('info', 'Parametro eliminada permanentemente.', { experiment }, req?.user?.id, req)
			return sendResponse(res, 200, 'Parametro eliminada permanentemente.')
		} catch (error) {
			await logEvent(
				'error',
				'Error al eliminar permanentemente el parametro.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			await t.rollback()
			return sendResponse(res, 500)
		}
	}
}
