import { db_main } from '../../../../config/db-config.js'
import { logEvent } from '../../../../shared/helpers/logger-helper.js'
import { SampleService } from '../../application/services/SampleService.js'
import { sendResponse } from '../../../../shared/helpers/responseHandler-helper.js'
import { PAGINATION_LIMIT, PAGINATION_PAGE } from '../../../../shared/constants/pagination-const.js'
import { sample_schema_zod, params_schema_zod } from '../validators/SampleSchema.js'
import { generateAntioxidantReportPDF } from '../../services/pdfkit.js'
import { generateAntioxidantReportWordDoc } from '../../services/dock.js'
import { Packer } from 'docx'

export class SampleController {
	static async getAll(req, res) {
		const { page = PAGINATION_PAGE, limit = PAGINATION_LIMIT, search = '' } = req?.query
		try {
			const dataFound = await SampleService.getAll(page, limit === 'all' ? null : limit, search)
			return sendResponse(res, 200, 'Muestras obtenidas exitosamente.', dataFound)
		} catch (error) {
			await logEvent(
				'error',
				'Error al obtener las muestras.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			return sendResponse(res, 500)
		}
	}

	static async getAllToQuote(req, res) {
		try {
			const dataFound = await SampleService.getAllToQuote(req.params.id)
			return sendResponse(res, 200, 'Muestras obtenidas exitosamente.', dataFound)
		} catch (error) {
			await logEvent(
				'error',
				'Error al obtener las muestras.',
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
			const parsedData = sample_schema_zod.safeParse(req.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const newdata = {
				...req.body,
				user: req.user.id,
			}
			const newData = await SampleService.create(newdata, t)
			if (newData.error) return sendResponse(res, 400, newData.error)

			await t.commit()

			await logEvent('info', 'Muestra creada exitosamente.', { newData }, req?.user.id, req)
			return sendResponse(res, 201, 'Muestra creada exitosamente.', newData)
		} catch (error) {
			await logEvent(
				'error',
				'Error al crear la muestra.',
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

			const parsedData = sample_schema_zod.safeParse(req.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const uptData = {
				...req.body,
				user: req.user.id,
			}

			const dataFound = await SampleService.update(req?.params?.id, uptData, t)
			if (dataFound.error) return sendResponse(res, dataFound.code, dataFound.error)

			await t.commit()

			await logEvent('info', 'Muestra actualizada exitosamente.', { dataFound }, req?.user?.id, req)
			return sendResponse(res, 200, 'Muestra actualizada exitosamente.')
		} catch (error) {
			await logEvent(
				'error',
				'Error al actualizar muestra.',
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

			const isCreatedSample = await SampleService.isCratedSample(req?.params?.id, req.user.id, t)
			if (isCreatedSample.error) return sendResponse(res, isCreatedSample?.code, isCreatedSample?.error)

			await SampleService.delete(req?.params?.id, t)

			await t.commit()

			await logEvent('info', 'Muestra eliminada exitosamente.', { isCreatedSample }, req?.user?.id, req)
			return sendResponse(res, 200, 'Muestra eliminada exitosamente.')
		} catch (error) {
			await logEvent(
				'error',
				'Error al eliminar la muestra.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			await t.rollback()
			return sendResponse(res, 500)
		}
	}

	static async reportPDF(req, res) {
		try {
			// Validar parámetros de entrada
			const parsedParams = params_schema_zod.safeParse(req?.params)
			if (!parsedParams.success) return sendResponse(res, 400, parsedParams.error.errors[0].message)

			// Obtener la muestra por ID
			const sample = await SampleService.getById(req?.params?.id)
			if (!sample) return sendResponse(res, 404, 'Muestra no encontrada.')

			// Registro del evento
			await logEvent('info', 'Reporte PDF generado.', { sample }, req?.user?.id, req)

			// Generar el documento PDF con la lógica separada
			const doc = generateAntioxidantReportPDF(sample)

			// Configurar respuesta para descarga de PDF
			res.setHeader('Content-Type', 'application/pdf')
			res.setHeader('Content-Disposition', `attachment; filename=Reporte_Muestra_${sample.code_assigned_ueb}.pdf`)

			// Enviar el PDF al cliente
			doc.pipe(res)
			doc.end()
		} catch (error) {
			await logEvent(
				'error',
				'Error al generar el reporte o eliminar la muestra.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			return sendResponse(res, 500, 'Error al generar el reporte.')
		}
	}

	static async reportWord(req, res) {
		const t = await db_main.transaction()

		try {
			// Validar parámetros de entrada
			const parsedParams = params_schema_zod.safeParse(req?.params)
			if (!parsedParams.success) return sendResponse(res, 400, parsedParams.error.errors[0].message)

			// Obtener la muestra por ID
			const sample = await SampleService.getById(req?.params?.id)
			if (!sample) return sendResponse(res, 404, 'Muestra no encontrada.')

			const newData = {
				sample: req.params.id,
				user: req.user.id,
				collaborator: req.query.user,
				quote: req.query.quote,
			}
			const newReport = await SampleService.createSecuenceReport(newData, t)

			await logEvent('info', 'Reporte Word generado.', { newReport }, req?.user?.id, req)

			await t.commit()

			// Generar el documento Word con la lógica separada
			const doc = generateAntioxidantReportWordDoc(sample, newReport)
			const buffer = await Packer.toBuffer(doc)

			// Configurar respuesta para descarga de Word
			res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
			res.setHeader('Content-Disposition', `attachment; filename=Reporte_Muestra_${sample.code_assigned_ueb}.docx`)

			// Enviar el documento al cliente
			res.send(buffer)
		} catch (error) {
			await logEvent(
				'error',
				'Error al generar el reporte Word.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			await t.rollback()
			return sendResponse(res, 500, 'Error al generar el reporte.')
		}
	}
}
