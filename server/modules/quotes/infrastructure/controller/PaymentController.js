import { params_schema_zod, bill_status_schema_zod } from '../validators/QuoteSchema.js'
import { db_main } from '../../../../config/db-config.js'
import { PaymentService } from '../../application/services/PaymentService.js'
import { QuotesService } from '../../application/services/QuotesService.js'
import { logEvent } from '../../../../shared/helpers/logger-helper.js'
import { RedisCache } from '../../../../shared/services/redis-service.js'
import { REDIS_KEYS } from '../../../../shared/constants/redisKey-const.js'
import { sendResponse } from '../../../../shared/helpers/responseHandler-helper.js'

export class PaymentController {
	static async addBill(req, res) {
		const t = await db_main.transaction()

		try {
			const parsedParams = params_schema_zod.safeParse(req?.params)
			if (!parsedParams.success) return sendResponse(res, 400, parsedParams.error.errors[0].message)

			const parsedData = bill_status_schema_zod.safeParse(req?.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const dataFound = await QuotesService.getById(req?.params?.id)
			if (!dataFound) return sendResponse(res, 404, 'Cotización no encontrada.')

			const existingPayment = await PaymentService.getById(dataFound.id_quote)

			let userData
			if (!existingPayment) {
				userData = await PaymentService.create(req?.params?.id, req.body, t)
			} else {
				userData = await PaymentService.update(existingPayment.id_quote_payment, req.body, t)
			}

			await t.commit()

			await logEvent('info', 'Pago de cotización actualizado exitosamente.', { userData }, req?.user?.id, req)
			return sendResponse(res, 200, 'Pago de cotización actualizado exitosamente.')
		} catch (error) {
			await logEvent(
				'error',
				'Error al actualizar el pago de cotización.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			await t.rollback()
			return sendResponse(res, 500)
		}
	}

	static async deleteBill(req, res) {
		const t = await db_main.transaction()

		try {
			const parsedParams = params_schema_zod.safeParse(req?.params)
			if (!parsedParams.success) return sendResponse(res, 400, parsedParams.error.errors[0].message)

			const dataFound = await PaymentService.getById(req?.params?.id)
			if (!dataFound) return sendResponse(res, 404, 'Cotización no encontrado.')

			const userData = await PaymentService.delete(req?.params?.id, req.body, t)

			await t.commit()

			await logEvent('info', 'Pago de cotización eliminado exitosamente.', { userData }, req?.user?.id, req)
			return sendResponse(res, 200, 'Pago de cotización eliminado exitosamente.')
		} catch (error) {
			await logEvent(
				'error',
				'Error el eliminar el pago de cotización.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			await t.rollback()
			return sendResponse(res, 500)
		}
	}
}
