import { db_main } from '../../../config/db-config.js'
import { logEvent } from '../../../shared/helpers/logger-helper.js'
import { RedisCache } from '../../../shared/services/redis-service.js'
import { REDIS_KEYS } from '../../../shared/constants/redisKey-const.js'
import { ApplicantService } from '../application/services/ApplicantService.js'
import { sendResponse } from '../../../shared/helpers/responseHandler-helper.js'
import { PAGINATION_LIMIT, PAGINATION_PAGE } from '../../../shared/constants/pagination-const.js'
import { applicant_schema_zod, params_schema_zod } from '../validators/applicantSchema.js'

export class ApplicantController {
	static async getById(req, res) {
		const cacheKey = `cache:${REDIS_KEYS.LABS.ACCESS}:${req?.params?.id}`

		try {
			const parsedData = params_schema_zod.safeParse(req?.params)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const dataCache = await RedisCache.getFromCache(cacheKey)
			if (dataCache) return sendResponse(res, 200, 'Acceso a laboratorio obtenido exitosamente.', dataCache)

			const dataFound = await ApplicantService.getById(req.params.id)
			if (!dataFound) return sendResponse(res, 404, 'Acceso a laboratorio no econtrado.')

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

		try {
			const parsedData = applicant_schema_zod.safeParse(req.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const newData = await ApplicantService.create(req.body, t)
			if (newData.error) return sendResponse(res, newData.code, newData.error)

			await RedisCache.clearCache(cacheKey)
			await t.commit()

			await logEvent('info', 'Aplicante añadido exitosamente.', { data: newData.user }, req?.user?.id, req)
			return sendResponse(res, 201, 'Aplicante añadido exitosamente.', newData.user)
		} catch (error) {
			await logEvent(
				'error',
				'Error al crear el aplicante.',
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
		const cacheKey = `cache:${REDIS_KEYS.LABS.ACCESS}:*`

		try {
			const parsedParams = params_schema_zod.safeParse(req.params)
			if (!parsedParams.success) return sendResponse(res, 400, parsedParams.error.errors[0].message)

			const parsedData = applicant_schema_zod.safeParse(req.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const uptData = await ApplicantService.update(req?.params?.id, req.body, t)
			if (!uptData) return sendResponse(res, uptData.code, uptData.error)

			await RedisCache.clearCache(cacheKey)
			await t.commit()

			await logEvent('info', 'Aplicante actualizado exitosamente.', { uptData }, req?.user?.id, req)
			return sendResponse(res, 200, 'Aplicante actualizado exitosamente.')
		} catch (error) {
			await logEvent(
				'error',
				'Error al actualizar aplicante.',
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
		const cacheKey = `cache:${REDIS_KEYS.LABS.ACCESS}:*`

		try {
			const parsedParams = params_schema_zod.safeParse(req?.params)
			if (!parsedParams.success) return sendResponse(res, 400, parsedParams.error.errors[0].message)

			const deleteData = await ApplicantService.delete(req?.params?.id, t)
			if (!deleteData) return sendResponse(res, deleteData.code, deleteData.error)

			await RedisCache.clearCache(cacheKey)
			await t.commit()

			await logEvent('info', 'Aplicante eliminado permanentemente.', { data: req.body }, req?.user?.id, req)
			return sendResponse(res, 200, 'Aplicante eliminado permanentemente.')
		} catch (error) {
			await logEvent(
				'error',
				'Error al eliminar el aplicante.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			await t.rollback()
			return sendResponse(res, 500)
		}
	}
}
