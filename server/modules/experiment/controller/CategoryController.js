import { params_schema_zod, category_schema_zod } from '../validators/categorySchema.js'
import { db_main } from '../../../config/db-config.js'
import { logEvent } from '../../../shared/helpers/logger-helper.js'
import { RedisCache } from '../../../shared/services/redis-service.js'
import { REDIS_KEYS } from '../../../shared/constants/redisKey-const.js'
import { CategoryService } from '../application/services/CategoryService.js'
import { sendResponse } from '../../../shared/helpers/responseHandler-helper.js'
import { PAGINATION_LIMIT, PAGINATION_PAGE } from '../../../shared/constants/pagination-const.js'

export class CetegoryController {
	static async getAll(req, res) {
		const { page = PAGINATION_PAGE, limit = PAGINATION_LIMIT, search = '' } = req?.query

		try {
			const dataFound = await CategoryService.getAll(page, limit, search)
			return sendResponse(res, 200, 'Categorias de experimentos obtenidos exitosamente.', dataFound)
		} catch (error) {
			await logEvent(
				'error',
				'Error al obtener los accesos a categorias de experimentos.',
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
			const parsedData = category_schema_zod.safeParse(req.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const newData = await CategoryService.create(req.body, t)
			if (newData.error) return sendResponse(res, 400, newData.error)

			await t.commit()

			await logEvent('info', 'Categoria creada exitosamente.', { newData }, req?.user?.id, req)
			return sendResponse(res, 201, 'Categoria creada exitosamente.')
		} catch (error) {
			await logEvent(
				'error',
				'Error al crear el categoria del experimento.',
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

			const parsedData = category_schema_zod.safeParse(req.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const dataFound = await CategoryService.getById(req?.params?.id)
			if (!dataFound) return sendResponse(res, 404, 'Categoria no encontrada.')

			const updateData = await CategoryService.update(req.params.id, req.body, t)

			await t.commit()

			await logEvent('info', 'Categoria actualizada exitosamente.', { updateData }, req?.user?.id, req)
			return sendResponse(res, 200, 'Categoria actualizada exitosamente.')
		} catch (error) {
			await logEvent(
				'error',
				'Error al actualizar categoria.',
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

			const experiment = await CategoryService.getById(req?.params?.id)
			if (!experiment) return sendResponse(res, 404, 'Categoria no encontrada.')

			await CategoryService.restore(req?.params?.id, t)

			await t.commit()

			await logEvent('info', 'Categoria restaurada exitosamente.', { experiment }, req?.user?.id, req)
			return sendResponse(res, 200, 'Categoria restaurada exitosamente.')
		} catch (error) {
			await logEvent(
				'error',
				'Error al restaurar categoria.',
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

			const experiment = await CategoryService.getById(req?.params?.id)
			if (!experiment) return sendResponse(res, 404, 'Categoria no encontrada.')

			await CategoryService.delete(req?.params?.id, t)

			await t.commit()

			await logEvent('info', 'Categoria eliminada exitosamente.', { experiment }, req?.user?.id, req)
			return sendResponse(res, 200, 'Categoria eliminada exitosamente.')
		} catch (error) {
			await logEvent(
				'error',
				'Error al eliminar la categoria.',
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

			const experiment = await CategoryService.getById(req?.params?.id)
			if (!experiment) return sendResponse(res, 404, 'Categoria no encontrada.')

			await CategoryService.deletePermanent(req?.params?.id, t)

			await t.commit()

			await logEvent('info', 'Categoria eliminada permanentemente.', { experiment }, req?.user?.id, req)
			return sendResponse(res, 200, 'Categoria eliminada permanentemente.')
		} catch (error) {
			await logEvent(
				'error',
				'Error al eliminar permanentemente la categoria.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			await t.rollback()
			return sendResponse(res, 500)
		}
	}
}
