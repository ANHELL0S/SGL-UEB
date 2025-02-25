import { quote_schema_zod, params_schema_zod, quote_status_schema_zod } from '../validators/QuoteSchema.js'
import { db_main } from '../../../../config/db-config.js'
import { QuotesService } from '../../application/services/QuotesService.js'
import { logEvent } from '../../../../shared/helpers/logger-helper.js'
import { sendResponse } from '../../../../shared/helpers/responseHandler-helper.js'
import { PAGINATION_LIMIT, PAGINATION_PAGE } from '../../../../shared/constants/pagination-const.js'
import { sendMailQuotation } from '../../services/node-mailer.js'
import { quotes_pdf_Scheme, system_config_Schema } from '../../../../schema/schemes.js'

export class QuotesController {
	static async getAll(req, res) {
		const { page = PAGINATION_PAGE, limit = PAGINATION_LIMIT, search = '' } = req?.query

		try {
			const dataFound = await QuotesService.getAll(page, limit === 'all' ? null : limit, search)
			return sendResponse(res, 200, 'Cotizaciones obtenidas exitosamente.', dataFound)
		} catch (error) {
			await logEvent(
				'error',
				'Error al obtener las cotizaciones.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			return sendResponse(res, 500)
		}
	}

	static async getById(req, res) {
		try {
			const parsedData = params_schema_zod.safeParse(req?.params)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const dataFound = await QuotesService.getById(req?.params?.id)
			if (!dataFound) return sendResponse(res, 404, 'Cotización no encontrada.')

			return sendResponse(res, 200, 'Cotización obtenida exitosamente.', dataFound)
		} catch (error) {
			await logEvent(
				'error',
				'Error al obtener la cotización.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			return sendResponse(res, 500)
		}
	}

	static async getByCodeQuote(req, res) {
		try {
			const dataFound = await QuotesService.getByCode(req.params.code)
			if (dataFound.error) return sendResponse(res, dataFound.code, dataFound.error)
			return sendResponse(res, 200, 'Cotización obtenida exitosamente.', dataFound)
		} catch (error) {
			await logEvent(
				'error',
				'Error al obtener la cotización.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			return sendResponse(res, 500)
		}
	}

	static async getAllPertainToAnalyst(req, res) {
		const { page = PAGINATION_PAGE, limit = PAGINATION_LIMIT, search = '' } = req?.query

		try {
			const dataFound = await QuotesService.getAllPertainToAnalyst(req.user.id, page, limit, search)
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

	static async create(req, res) {
		const t = await db_main.transaction()
		try {
			const parsedData = quote_schema_zod.safeParse(req.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const newData = await QuotesService.create(req.body, t)
			if (newData.error) return sendResponse(res, 400, newData.error)

			await t.commit()

			const infoU = await system_config_Schema.findOne()
			const institutionData = {
				name: infoU.institution_name,
				address: infoU.address,
				contact: `${infoU.contact_phone}`,
			}

			const findQuote = await QuotesService.getById(newData.quote.id_quote)
			const quotePDF = await sendMailQuotation(findQuote, institutionData)

			await quotes_pdf_Scheme.create({ id_quote_fk: newData.quote.id_quote, pdfQuote: quotePDF })

			await logEvent('info', 'Cotización creada y enviada exitosamente.', { newData }, req?.user?.id, req)
			return sendResponse(res, 201, 'Cotización creada y enviada exitosamente.', newData)
		} catch (error) {
			await logEvent(
				'error',
				'Error al crear y enviar la cotización.',
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

			const parsedData = quote_schema_zod.safeParse(req.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const findQuote = await QuotesService.getById(req?.params?.id)
			if (!findQuote) return sendResponse(res, 404, 'Cotización no encontrada.')

			const uptData = await QuotesService.update(req?.params?.id, req.body, t)
			if (uptData.error) return sendResponse(res, 400, uptData.error)

			await t.commit()

			await logEvent('info', 'Cotización actualizada exitosamente.', { uptData }, req?.user?.id, req)
			return sendResponse(res, 200, 'Cotización actualizada exitosamente.')
		} catch (error) {
			await logEvent(
				'error',
				'Error al actualizar cotización.',
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

		try {
			const parsedParams = params_schema_zod.safeParse(req?.params)
			if (!parsedParams.success) return sendResponse(res, 400, parsedParams.error.errors[0].message)

			const parsedData = quote_status_schema_zod.safeParse(req?.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const dataFound = await QuotesService.getById(req?.params?.id)
			if (!dataFound) return sendResponse(res, 404, 'Cotización no encontrado.')

			const userData = await QuotesService.changeStatus(req?.params?.id, req.body, t)

			await t.commit()

			await logEvent('info', 'Estado de cotización actualizado exitosamente.', { userData }, req?.user?.id, req)
			return sendResponse(res, 200, 'Estado de cotización actualizado exitosamente.')
		} catch (error) {
			await logEvent(
				'error',
				'Error al actualizar el estado de cotización.',
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

			const dataFound = await QuotesService.getById(req?.params?.id)
			if (!dataFound) return sendResponse(res, 404, 'Cotización no encontrado.')

			await QuotesService.delete(req?.params?.id, t)

			await t.commit()

			await logEvent('info', 'Cotización eliminada exitosamente.', { dataFound }, req?.user?.id, req)
			return sendResponse(res, 200, 'Cotización eliminada exitosamente.')
		} catch (error) {
			await logEvent(
				'error',
				'Error al eliminar la cotización.',
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

			const experiment = await QuotesService.getById(req?.params?.id)
			if (!experiment) return sendResponse(res, 404, 'Cotización no encontrada.')

			await QuotesService.restore(req?.params?.id, t)

			await t.commit()

			await logEvent('info', 'Cotización restaurada exitosamente.', { experiment }, req?.user?.id, req)
			return sendResponse(res, 200, 'Cotización restaurada exitosamente.')
		} catch (error) {
			await logEvent(
				'error',
				'Error al restaurar la cotización.',
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

			const experiment = await QuotesService.getById(req?.params?.id)
			if (!experiment) return sendResponse(res, 404, 'Cotización no encontrada.')

			await QuotesService.deletePermanent(req?.params?.id, t)

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
