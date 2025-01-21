import xlsx from 'xlsx'
import { db_main } from '../../../../config/db-config.js'
import { logEvent } from '../../../../shared/helpers/logger-helper.js'
import { RedisCache } from '../../../../shared/services/redis-service.js'
import { REDIS_KEYS } from '../../../../shared/constants/redisKey-const.js'
import { ReactiveService } from '../../application/services/reactiveService.js'
import { sendResponse } from '../../../../shared/helpers/responseHandler-helper.js'
import { PAGINATION_LIMIT, PAGINATION_PAGE } from '../../../../shared/constants/pagination-const.js'
import { reactive_schema_zod, params_schema_zod, reactive_status_schema_zod } from '../../validators/reactiveSchema.js'

export class ReactiveController {
	static async getAll(req, res) {
		const { page = PAGINATION_PAGE, limit = PAGINATION_LIMIT, search = '' } = req?.query
		const cacheKey = `cache:${REDIS_KEYS.REACTIVES.REACTIVE}:page:${page}:limit:${limit}:search:${search}`

		try {
			const dataCache = await RedisCache.getFromCache(cacheKey)
			if (dataCache) return sendResponse(res, 200, 'Reactivos obtenidos exitosamente.', dataCache)

			const dataFound = await ReactiveService.getAll(page, limit === 'all' ? null : limit, search)
			await RedisCache.setInCache(cacheKey, dataFound)

			return sendResponse(res, 200, 'Reactivos obtenidos exitosamente.', dataFound)
		} catch (error) {
			await logEvent(
				'error',
				'Error al obtener los reactivos.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			return sendResponse(res, 500)
		}
	}

	static async getById(req, res) {
		const cacheKey = `cache:${REDIS_KEYS.REACTIVES.REACTIVE}:${req?.params?.id}`

		try {
			const parsedData = params_schema_zod.safeParse(req?.params)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const cachedUser = await RedisCache.getFromCache(cacheKey)
			if (cachedUser) return sendResponse(res, 200, 'Laboratorio obtenido exitosamente.', cachedUser)

			const userFound = await ReactiveService.getLabById(req?.params?.id)
			if (!userFound) return sendResponse(res, 404, 'Laboratorio no encontrado.')

			await RedisCache.setInCache(cacheKey, userFound)

			return sendResponse(res, 200, 'Laboratorio obtenido exitosamente.', userFound)
		} catch (error) {
			await logEvent(
				'error',
				'Error al obtener el laboratorio.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			return sendResponse(res, 500)
		}
	}

	static async findToName(req, res) {
		const cacheKey = `cache:${REDIS_KEYS.REACTIVES.REACTIVE}:${req?.params?.name}`

		try {
			const cachedData = await RedisCache.getFromCache(cacheKey)
			if (cachedData) return sendResponse(res, 200, 'Laboratorio obtenido exitosamente.', cachedData)

			const dataFound = await ReactiveService.findToName(req?.params?.name)
			if (!dataFound) return sendResponse(res, 404, 'Laboratorio no encontrado.')
			await RedisCache.setInCache(cacheKey, dataFound)

			return sendResponse(res, 200, 'Laboratorio obtenido exitosamente.', dataFound)
		} catch (error) {
			await logEvent(
				'error',
				'Error al obtener el laboratorio.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			return sendResponse(res, 500)
		}
	}

	static async uploadedFile(req, res) {
		const t = await db_main.transaction()
		const cacheKey = `cache:${REDIS_KEYS.REACTIVES.REACTIVE}:*`

		try {
			if (!req.file) return sendResponse(res, 400, 'No se ha subido ningún archivo.')

			const workbook = xlsx.read(req.file.buffer, { type: 'buffer' })
			const sheetName = workbook.SheetNames[0]
			const sheet = workbook.Sheets[sheetName]
			const jsonData = xlsx.utils.sheet_to_json(sheet)

			const result = await ReactiveService.uploadedFile(jsonData, t)
			if (result.error) return sendResponse(res, result.status, result.error)

			await t.commit()
			await RedisCache.clearCache(cacheKey)

			await logEvent('info', 'Reactivos creados exitosamente.', { result }, req?.user?.id, req)
			return sendResponse(res, 201, 'Reactivos creados exitosamente.', result)
		} catch (error) {
			await logEvent(
				'error',
				'Error al crear los reactivos.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			await t.rollback()
			return sendResponse(res, 500, 'Error al procesar el archivo')
		}
	}

	static async create(req, res) {
		const t = await db_main.transaction()
		const cacheKey = `cache:${REDIS_KEYS.REACTIVES.REACTIVE}:*`

		try {
			const parsedData = reactive_schema_zod.safeParse(req.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const result = await ReactiveService.create(req.body, t)
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
		const cacheKey = `cache:${REDIS_KEYS.REACTIVES.REACTIVE}:*`

		try {
			const parsedParams = params_schema_zod.safeParse(req.params)
			if (!parsedParams.success) return sendResponse(res, 400, parsedParams.error.errors[0].message)

			const parsedData = reactive_schema_zod.safeParse(req.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const labFound = await ReactiveService.getLabById(req?.params?.id)
			if (!labFound) return sendResponse(res, 404, 'Laboratorio no encontrado.')

			const labData = await ReactiveService.updateLab(req?.params?.id, req.body, t)
			if (labData.error) return sendResponse(res, 400, labData.error)

			await RedisCache.clearCache(cacheKey)
			await t.commit()

			await logEvent('info', 'Laboratorio actualizado exitosamente.', { labData }, req?.user?.id, req)
			return sendResponse(res, 200, 'Laboratorio actualizado exitosamente.')
		} catch (error) {
			await logEvent(
				'error',
				'Error al actualizar laboratorio.',
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
		const cacheKey = `cache:${REDIS_KEYS.REACTIVES.REACTIVE}:*`

		try {
			const parsedParams = params_schema_zod.safeParse(req?.params)
			if (!parsedParams.success) return sendResponse(res, 400, parsedParams.error.errors[0].message)

			const parsedData = reactive_status_schema_zod.safeParse(req?.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const userFound = await ReactiveService.getById(req?.params?.id)
			if (!userFound) return sendResponse(res, 404, 'Reactivo no encontrado.')

			const userData = await ReactiveService.changeStatus(req?.params?.id, req.body, t)

			await RedisCache.clearCache(cacheKey)
			await t.commit()

			await logEvent('info', 'Estado de reactivo actualizado exitosamente.', { userData }, req?.user?.id, req)
			return sendResponse(res, 200, 'Estado de reactivo actualizado exitosamente.')
		} catch (error) {
			await logEvent(
				'error',
				'Error al actualizar el estado del reactivo.',
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
		const cacheKey = `cache:${REDIS_KEYS.REACTIVES.REACTIVE}:*`

		try {
			const parsedParams = params_schema_zod.safeParse(req?.params)
			if (!parsedParams.success) return sendResponse(res, 400, parsedParams.error.errors[0].message)

			const userFound = await ReactiveService.getLabById(req?.params?.id)
			if (!userFound) return sendResponse(res, 404, 'Laboratorio no encontrado.')

			const labData = await ReactiveService.deleteLab(req?.params?.id, t)
			if (labData.error) return sendResponse(res, 400, labData.error)

			await RedisCache.clearCache(cacheKey)
			await t.commit()

			await logEvent('info', 'Laboratorio eliminado exitosamente.', { labData }, req?.user?.id, req)
			return sendResponse(res, 200, 'Laboratorio eliminado exitosamente.')
		} catch (error) {
			await logEvent(
				'error',
				'Error al eliminar el laboratorio.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			await t.rollback()
			return sendResponse(res, 500)
		}
	}
}
