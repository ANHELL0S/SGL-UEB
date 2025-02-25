import { logEvent } from '../../../shared/helpers/logger-helper.js'
import { params_schema_zod } from '../validators/facultySchema.js'
import { RedisCache } from '../../../shared/services/redis-service.js'
import { REDIS_KEYS } from '../../../shared/constants/redisKey-const.js'
import { FacultyService } from '../application/services/FacultyService.js'
import { sendResponse } from '../../../shared/helpers/responseHandler-helper.js'

export class FacultyController {
	static async getAll(req, res) {
		try {
			const dataFound = await FacultyService.getAll()
			return sendResponse(res, 200, 'Facultades obtenidas exitosamente.', dataFound)
		} catch (error) {
			await logEvent(
				'error',
				'Error al obtener las facultades.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			return sendResponse(res, 500)
		}
	}

	static async getById(req, res) {
		try {
			const parsedParams = params_schema_zod.safeParse(req.params)
			if (!parsedParams.success) return sendResponse(res, 400, parsedParams.error.errors[0].message)

			const dataFound = await FacultyService.getById(req.params.id)

			return sendResponse(res, 200, 'Facultades obtenidos exitosamente.', dataFound)
		} catch (error) {
			await logEvent(
				'error',
				'Error al obtener las facultades.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			return sendResponse(res, 500)
		}
	}
}
