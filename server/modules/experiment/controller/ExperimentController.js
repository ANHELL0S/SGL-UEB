import { db_main } from '../../../config/db-config.js'
import { logEvent } from '../../../shared/helpers/logger-helper.js'
import { RedisCache } from '../../../shared/services/redis-service.js'
import { ExperimentService } from '../application/services/ExperimentService.js'
import { sendResponse } from '../../../shared/helpers/responseHandler-helper.js'
import { REDIS_KEYS } from '../../../shared/constants/redisKey-const.js'
import { PAGINATION_LIMIT, PAGINATION_PAGE } from '../../../shared/constants/pagination-const.js'
import {
	experiment_schema_zod,
	params_schema_zod,
	experiment_status_schema_zod,
} from '../validators/experimentSchema.js'

export class ExperimentController {
	static async getAll(req, res) {
		const { page = PAGINATION_PAGE, limit = PAGINATION_LIMIT, search = '' } = req?.query
		const cacheKey = `cache:${REDIS_KEYS.LABS.EXPERIMENT}:page:${page}:limit:${limit}:search:${search}`

		try {
			const dataCache = await RedisCache.getFromCache(cacheKey)
			if (dataCache) return sendResponse(res, 200, 'Experimentos obtenidos exitosamente.', dataCache)

			const dataFound = await ExperimentService.getAll(page, limit, search)
			await RedisCache.setInCache(cacheKey, dataFound)

			return sendResponse(res, 200, 'Experimentos obtenidos exitosamente.', dataFound)
		} catch (error) {
			await logEvent(
				'error',
				'Error al obtener los accesos a experimentos.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			return sendResponse(res, 500)
		}
	}

	static async create(req, res) {
		const t = await db_main.transaction()
		const cacheKey = `cache:${REDIS_KEYS.LABS.EXPERIMENT}:*`

		try {
			const parsedData = experiment_schema_zod.safeParse(req.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const newData = await ExperimentService.create(req.user.id, req.body, t)
			if (newData.error) return sendResponse(res, 400, newData.error)

			await RedisCache.clearCache(cacheKey)
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
		const cacheKey = `cache:${REDIS_KEYS.LABS.EXPERIMENT}:page:*`

		try {
			const parsedParams = params_schema_zod.safeParse(req.params)
			if (!parsedParams.success) return sendResponse(res, 400, parsedParams.error.errors[0].message)

			const parsedData = experiment_schema_zod.safeParse(req.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const experiment = await ExperimentService.getById(req?.params?.id)
			if (!experiment) return sendResponse(res, 404, 'Experimento no encontrado.')

			const experimentUpdated = await ExperimentService.update(req?.params?.id, req.body, t)

			await RedisCache.clearCache(cacheKey)
			await t.commit()

			await logEvent('info', 'Experimento actualizado exitosamente.', { experimentUpdated }, req?.user?.id, req)
			return sendResponse(res, 200, 'Experimento actualizado exitosamente.')
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
		const cacheKey = `cache:${REDIS_KEYS.LABS.EXPERIMENT}:page:*`

		try {
			const parsedParams = params_schema_zod.safeParse(req?.params)
			if (!parsedParams.success) return sendResponse(res, 400, parsedParams.error.errors[0].message)

			const parsedData = experiment_status_schema_zod.safeParse(req?.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const experiment = await ExperimentService.getById(req?.params?.id)
			if (!experiment) return sendResponse(res, 404, 'Experimento no encontrado.')

			const experimentUpdated = await ExperimentService.changeStatus(req?.params?.id, req.body, t)

			await RedisCache.clearCache(cacheKey)
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
		const cacheKey = `cache:${REDIS_KEYS.LABS.EXPERIMENT}:page:*`

		try {
			const parsedParams = params_schema_zod.safeParse(req?.params)
			if (!parsedParams.success) return sendResponse(res, 400, parsedParams.error.errors[0].message)

			const experiment = await ExperimentService.getById(req?.params?.id)
			if (!experiment) return sendResponse(res, 404, 'Experimento no encontrado.')

			await ExperimentService.delete(req?.params?.id, t)

			await RedisCache.clearCache(cacheKey)
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
}
