import { unit_measurement_schema_zod, params_schema_zod } from '../../validators/UnitMeasurementSchema.js'
import { db_main } from '../../../../config/db-config.js'
import { UnitMeasurementService } from '../../application/services/UnitMeasurementService.js'
import { logEvent } from '../../../../shared/helpers/logger-helper.js'
import { RedisCache } from '../../../../shared/services/redis-service.js'
import { REDIS_KEYS } from '../../../../shared/constants/redisKey-const.js'
import { sendResponse } from '../../../../shared/helpers/responseHandler-helper.js'
import { PAGINATION_LIMIT, PAGINATION_PAGE } from '../../../../shared/constants/pagination-const.js'

export class UnitMeasurementController {
	static async getAll(req, res) {
		const { page = PAGINATION_PAGE, limit = PAGINATION_LIMIT, search = '' } = req?.query
		const cacheKey = `cache:${REDIS_KEYS.REACTIVES.UNIT_MEASUREMENT}:page:${page}:limit:${limit}:search:${search}`

		try {
			const dataCache = await RedisCache.getFromCache(cacheKey)
			if (dataCache) return sendResponse(res, 200, 'Unidades de medida obtenidas exitosamente.', dataCache)

			const dataFound = await UnitMeasurementService.getAll(page, limit === 'all' ? null : limit, search)
			await RedisCache.setInCache(cacheKey, dataFound)

			return sendResponse(res, 200, 'Unidades de medida obtenidas exitosamente.', dataFound)
		} catch (error) {
			await logEvent(
				'error',
				'Error al obtener las unidades de medida.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			return sendResponse(res, 500)
		}
	}

	static async getById(req, res) {
		const cacheKey = `cache:${REDIS_KEYS.REACTIVES.UNIT_MEASUREMENT}:${req?.params?.id}`

		try {
			const parsedData = params_schema_zod.safeParse(req?.params)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const dataCache = await RedisCache.getFromCache(cacheKey)
			if (dataCache) return sendResponse(res, 200, 'Unidad de medida obtenida exitosamente.', dataCache)

			const dataFound = await UnitMeasurementService.getById(req?.params?.id)
			if (!dataFound) return sendResponse(res, 404, 'Unidad de medida no encontrado.')

			await RedisCache.setInCache(cacheKey, dataFound)

			return sendResponse(res, 200, 'Unidad de medida obtenida exitosamente.', dataFound)
		} catch (error) {
			await logEvent(
				'error',
				'Error al obtener la unidad de medida.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			return sendResponse(res, 500)
		}
	}

	static async create(req, res) {
		const t = await db_main.transaction()
		const cacheKey = `cache:${REDIS_KEYS.REACTIVES.UNIT_MEASUREMENT}:*`

		try {
			const parsedData = unit_measurement_schema_zod.safeParse(req.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const result = await UnitMeasurementService.create(req.body, t)
			if (result.error) return sendResponse(res, 400, result.error)

			await t.commit()

			await RedisCache.clearCache(cacheKey)

			await logEvent('info', 'Laboratorio creado exitosamente.', { result }, req?.user?.id, req)
			return sendResponse(res, 201, 'Laboratorio creado exitosamente.', result)
		} catch (error) {
			await logEvent(
				'error',
				'Error al crear el laboratorio.',
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
		const cacheKey = `cache:${REDIS_KEYS.REACTIVES.UNIT_MEASUREMENT}:*`

		try {
			const parsedParams = params_schema_zod.safeParse(req.params)
			if (!parsedParams.success) return sendResponse(res, 400, parsedParams.error.errors[0].message)

			const parsedData = unit_measurement_schema_zod.safeParse(req.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const labFound = await UnitMeasurementService.getById(req?.params?.id)
			if (!labFound) return sendResponse(res, 404, 'Unidad de medida no encontrada.')

			const labData = await UnitMeasurementService.update(req?.params?.id, req.body, t)
			if (labData.error) return sendResponse(res, 400, labData.error)

			await RedisCache.clearCache(cacheKey)
			await t.commit()

			await logEvent('info', 'Unidad de medida actualizada exitosamente.', { labData }, req?.user?.id, req)
			return sendResponse(res, 200, 'Unidad de medida actualizada exitosamente.')
		} catch (error) {
			await logEvent(
				'error',
				'Error al actualizar unidad de medida.',
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
		const cacheKey = `cache:${REDIS_KEYS.REACTIVES.LAB}:*`

		try {
			const parsedParams = params_schema_zod.safeParse(req?.params)
			if (!parsedParams.success) return sendResponse(res, 400, parsedParams.error.errors[0].message)

			const userFound = await UnitMeasurementService.getById(req?.params?.id)
			if (!userFound) return sendResponse(res, 404, 'Unidad de medida no encontrada.')

			const labData = await UnitMeasurementService.delete(req?.params?.id, t)
			if (labData.error) return sendResponse(res, 400, labData.error)

			await RedisCache.clearCache(cacheKey)
			await t.commit()

			await logEvent('info', 'Unidad de medida eliminada exitosamente.', { labData }, req?.user?.id, req)
			return sendResponse(res, 200, 'Unidad de medida eliminada exitosamente.')
		} catch (error) {
			await logEvent(
				'error',
				'Error al eliminar la unidad de medida.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			await t.rollback()
			return sendResponse(res, 500)
		}
	}
}
