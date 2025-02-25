import { logEvent } from '../../../../shared/helpers/logger-helper.js'
import { LogService } from '../../application/services/logService.js'
import { sendResponse } from '../../../../shared/helpers/responseHandler-helper.js'
import { PAGINATION_LIMIT, PAGINATION_PAGE } from '../../../../shared/constants/pagination-const.js'

export class LogController {
	static async getAll(req, res) {
		const { page = PAGINATION_PAGE, limit = PAGINATION_LIMIT, search = '' } = req?.query
		try {
			const dataFound = await LogService.getAll(page, limit === 'all' ? null : limit, search)
			return sendResponse(res, 200, 'Logs obtenidos exitosamente.', dataFound)
		} catch (error) {
			await logEvent(
				'error',
				'Error al obtener logs.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			return sendResponse(res, 500)
		}
	}
}
