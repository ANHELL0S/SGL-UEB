import { db_main } from '../../../config/db-config.js'
import { logEvent } from '../../../shared/helpers/logger-helper.js'
import { RedisCache } from '../../../shared/services/redis-service.js'
import { REDIS_KEYS } from '../../../shared/constants/redisKey-const.js'
import { AccessLabService } from '../application/services/AcesslabService.js'
import { sendResponse } from '../../../shared/helpers/responseHandler-helper.js'
import { PAGINATION_LIMIT, PAGINATION_PAGE } from '../../../shared/constants/pagination-const.js'
import { accessLab_schema_zod, accessLab_status_schema_zod, params_schema_zod } from '../validators/accesslabSchema.js'

export class AccessLabController {
	static async getAll(req, res) {
		const { page = PAGINATION_PAGE, limit = PAGINATION_LIMIT, search = '' } = req?.query
		const cacheKey = `cache:${REDIS_KEYS.LABS.ACCESS}:page:${page}:limit:${limit}:search:${search}`

		try {
			const dataCache = await RedisCache.getFromCache(cacheKey)
			if (dataCache) return sendResponse(res, 200, 'Accesos a laboratorios obtenidos exitosamente.', dataCache)

			const dataFound = await AccessLabService.getAll(page, limit, search)
			await RedisCache.setInCache(cacheKey, dataFound)

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

	static async getAllPertainLab(req, res) {
		const { page = PAGINATION_PAGE, limit = PAGINATION_LIMIT, search = '' } = req?.query
		const cacheKey = `cache:${REDIS_KEYS.LABS.ACCESS}:lab:${req.params.id}:page:${page}:limit:${limit}:search:${search}`

		try {
			const dataCache = await RedisCache.getFromCache(cacheKey)
			if (dataCache) return sendResponse(res, 200, 'Accesos a laboratorios obtenidos exitosamente.', dataCache)

			const dataFound = await AccessLabService.getAllPertainLab(req.params.id, page, limit, search)
			await RedisCache.setInCache(cacheKey, dataFound)

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
		const cacheKey = `cache:${REDIS_KEYS.LABS.ACCESS}:${req?.params?.id}`

		try {
			const parsedData = params_schema_zod.safeParse(req?.params)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const dataCache = await RedisCache.getFromCache(cacheKey)
			if (dataCache) return sendResponse(res, 200, 'Acceso a laboratorio obtenido exitosamente.', dataCache)

			const dataFound = await AccessLabService.getById(req.params.id)
			await RedisCache.setInCache(cacheKey, dataFound)

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
		const cacheKey = `cache:${REDIS_KEYS.LABS.ACCESS}:*`
		const cacheLabKey = `cache:${REDIS_KEYS.LABS.LAB}:*`

		try {
			const parsedData = accessLab_schema_zod.safeParse(req.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const accessLabData = await AccessLabService.create(req.body, t)
			if (accessLabData.error) return sendResponse(res, 400, accessLabData.error)

			await RedisCache.clearCache(cacheKey)
			await RedisCache.clearCache(cacheLabKey)
			await t.commit()

			await logEvent('info', 'Acceso creado exitosamente.', { data: accessLabData.user }, req?.user?.id, req)
			return sendResponse(res, 201, 'Acceso creado exitosamente.', accessLabData.user)
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
		const cacheAccessKey = `cache:${REDIS_KEYS.LABS.ACCESS}:*`
		const cacheLabKey = `cache:${REDIS_KEYS.LABS.LAB}:*`

		try {
			const parsedParams = params_schema_zod.safeParse(req.params)
			if (!parsedParams.success) return sendResponse(res, 400, parsedParams.error.errors[0].message)

			const parsedData = accessLab_schema_zod.safeParse(req.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const labFound = await AccessLabService.getById(req?.params?.id)
			if (!labFound) return sendResponse(res, 404, 'Acceso no encontrado.')

			const labData = await AccessLabService.update(req?.params?.id, req.body, t)

			await clearCache([cacheAccessKey, cacheLabKey])
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
		const cacheKey = `cache:${REDIS_KEYS.LABS.ACCESS}:*`

		try {
			const parsedParams = params_schema_zod.safeParse(req.params)
			if (!parsedParams.success) return sendResponse(res, 400, parsedParams.error.errors[0].message)

			const parsedData = accessLab_status_schema_zod.safeParse(req.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const labFound = await AccessLabService.getById(req?.params?.id)
			if (!labFound) return sendResponse(res, 404, 'Acceso no encontrado.')

			const labData = await AccessLabService.update(req?.params?.id, req.body, t)

			await RedisCache.clearCache(cacheKey)
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

	static async delete(req, res) {
		const t = await db_main.transaction()
		const cacheKey = `cache:${REDIS_KEYS.LABS.ACCESS}:*`

		try {
			const parsedParams = params_schema_zod.safeParse(req?.params)
			if (!parsedParams.success) return sendResponse(res, 400, parsedParams.error.errors[0].message)

			const userFound = await AccessLabService.getById(req?.params?.id)
			if (!userFound) return sendResponse(res, 404, 'Acceso no encontrado.')

			const labData = await AccessLabService.delete(req?.params?.id, t)

			await RedisCache.clearCache(cacheKey)
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
}
