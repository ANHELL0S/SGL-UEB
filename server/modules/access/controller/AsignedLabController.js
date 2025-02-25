import { db_main } from '../../../config/db-config.js'
import { logEvent } from '../../../shared/helpers/logger-helper.js'
import { RedisCache } from '../../../shared/services/redis-service.js'
import { REDIS_KEYS } from '../../../shared/constants/redisKey-const.js'
import { sendResponse } from '../../../shared/helpers/responseHandler-helper.js'
import { AsignedLabService } from '../application/services/AsignedLabService.js'
import { asignedLab_schema_zod, params_schema_zod } from '../validators/AsignedLabSchema.js'

export class AsignedLabController {
	static async getAllAsignedLabByQuoteId(req, res) {
		try {
			const parsedData = params_schema_zod.safeParse(req?.params)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const dataFound = await AsignedLabService.getAll(req?.params?.id)
			if (!dataFound) return sendResponse(res, 404, 'Laboratorios asignados no encontrados.')

			return sendResponse(res, 200, 'Laboratorios asignados obtenidos exitosamente.', dataFound)
		} catch (error) {
			await logEvent(
				'error',
				'Error al obtener los laboratorios asignados.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			return sendResponse(res, 500)
		}
	}

	static async asignedLab(req, res) {
		const t = await db_main.transaction()

		try {
			const parsedData = asignedLab_schema_zod.safeParse(req.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const newData = await AsignedLabService.create(req.body, t)
			if (newData.error) return sendResponse(res, 400, newData.error)

			await t.commit()

			await logEvent('info', 'Laboratorio/s asignado/s exitosamente.', { newData }, req?.user?.id, req)
			return sendResponse(res, 201, 'Laboratorio/s asignado/s exitosamente.', newData)
		} catch (error) {
			console.log(error)
			await logEvent(
				'error',
				'Error al asignar laboratorio/s.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			await t.rollback()
			return sendResponse(res, 500)
		}
	}

	static async deleteAsignedLab(req, res) {
		const t = await db_main.transaction()

		try {
			const parsedParams = params_schema_zod.safeParse(req?.params)
			if (!parsedParams.success) return sendResponse(res, 400, parsedParams.error.errors[0].message)

			const experiment = await AsignedLabService.getById(req?.params?.id)
			if (!experiment) return sendResponse(res, 404, 'Cotización no encontrada.')

			await AsignedLabService.deletePermanent(req?.params?.id, t)

			await t.commit()

			await logEvent('info', 'Cotización eliminada permanentemente.', { experiment }, req?.user?.id, req)
			return sendResponse(res, 200, 'Cotización eliminada permanentemente.')
		} catch (error) {
			await logEvent(
				'error',
				'Error al eliminar permanentemente cotización.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			await t.rollback()
			return sendResponse(res, 500)
		}
	}
}
