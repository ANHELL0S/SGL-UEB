import { db_main } from '../../../../config/db-config.js'
import { logEvent } from '../../../../shared/helpers/logger-helper.js'
import { RedisCache } from '../../../../shared/services/redis-service.js'
import { REDIS_KEYS } from '../../../../shared/constants/redisKey-const.js'
import { ResultService } from '../../application/services/ResultService.js'
import { sendResponse } from '../../../../shared/helpers/responseHandler-helper.js'
import { PAGINATION_LIMIT, PAGINATION_PAGE } from '../../../../shared/constants/pagination-const.js'
import { sample_result_schema_zod, params_schema_zod } from '../validators/SampleResultValidator.js'

export class SampleResultController {
	static async getAllToAccess(req, res) {
		const { page = PAGINATION_PAGE, limit = PAGINATION_LIMIT, search = '' } = req?.query

		try {
			const dataFound = await ResultService.getAllToSample(req.params.id, page, limit === 'all' ? null : limit, search)
			return sendResponse(res, 200, 'Resultados obtenidas exitosamente.', dataFound)
		} catch (error) {
			await logEvent(
				'error',
				'Error al obtener los resultados.',
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
			const parsedData = sample_result_schema_zod.safeParse(req.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const newdata = {
				...req.body,
				user: req.user.id,
			}
			const newData = await ResultService.create(newdata, t)
			if (newData.error) return sendResponse(res, newData.code, newData.error)

			await t.commit()

			await logEvent('info', 'Resultado creado exitosamente.', { newData }, req?.user.id, req)
			return sendResponse(res, 201, 'Resultado creado exitosamente.', newData)
		} catch (error) {
			await logEvent(
				'error',
				'Error al crear el resultado.',
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

			const parsedData = sample_result_schema_zod.safeParse(req.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const uptData = {
				...req.body,
				user: req.user.id,
			}
			const dataFound = await ResultService.update(req?.params?.id, uptData, t)
			if (dataFound.error) return sendResponse(res, dataFound.code, dataFound.error)

			await t.commit()

			await logEvent('info', 'Resultado de muestra actualizada exitosamente.', { dataFound }, req?.user?.id, req)
			return sendResponse(res, 200, 'Resultado de muestra actualizada exitosamente.')
		} catch (error) {
			await logEvent(
				'error',
				'Error al actualizar resultado de muestra.',
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

			const isCreatedResult = await ResultService.isCratedResult(req?.params?.id, req.user.id, t)
			if (isCreatedResult) return sendResponse(res, isCreatedResult.code, isCreatedResult.error)

			await ResultService.delete(req?.params?.id, t)

			await t.commit()

			await logEvent('info', 'Resultado de muestra eliminada.', {}, req?.user?.id, req)
			return sendResponse(res, 200, 'Resultado de muestra eliminada.')
		} catch (error) {
			await logEvent(
				'error',
				'Error al eliminar la Resultado de muestra.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			await t.rollback()
			return sendResponse(res, 500)
		}
	}
}
