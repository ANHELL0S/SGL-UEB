import { db_main } from '../../../../config/db-config.js'
import { params_schema_zod } from '../validators/SampleSchema.js'
import { logEvent } from '../../../../shared/helpers/logger-helper.js'
import { ReportService } from '../../application/services/ReportService.js'
import { sendResponse } from '../../../../shared/helpers/responseHandler-helper.js'
import { PAGINATION_LIMIT, PAGINATION_PAGE } from '../../../../shared/constants/pagination-const.js'
import moment from 'moment'
import { formatISOToDate } from '../../../../shared/utils/time-util.js'
import { system_config_Schema } from '../../../../schema/schemes.js'
import { generatePdfTable } from '../../../../shared/libs/pdfkitLib.js'

export class ReportController {
	static async getAll(req, res) {
		const { page = PAGINATION_PAGE, limit = PAGINATION_LIMIT, search = '' } = req?.query
		try {
			const dataFound = await ReportService.getAll(page, limit === 'all' ? null : limit, search)
			return sendResponse(res, 200, 'Reportes obtenidos exitosamente.', dataFound)
		} catch (error) {
			await logEvent(
				'error',
				'Error al obtener los reportes.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			return sendResponse(res, 500)
		}
	}

	static async getAllToSample(req, res) {
		try {
			const dataFound = await ReportService.getAllToSample(req.params.id)
			return sendResponse(res, 200, 'Reportes obtenidos exitosamente.', dataFound)
		} catch (error) {
			await logEvent(
				'error',
				'Error al obtener los reportes.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			return sendResponse(res, 500)
		}
	}

	static async update(req, res) {
		const t = await db_main.transaction()
		try {
			const parsedParams = params_schema_zod.safeParse(req.params)
			if (!parsedParams.success) return sendResponse(res, 400, parsedParams.error.errors[0].message)

			const dataFound = await ReportService.update(req?.params?.id, req.user.id, t)
			if (dataFound.error) return sendResponse(res, dataFound.code, dataFound.error)

			await t.commit()

			await logEvent('info', 'Estado de reporte actualizado exitosamente.', { dataFound }, req?.user?.id, req)
			return sendResponse(res, 200, 'Estado de reporte actualizado exitosamente.')
		} catch (error) {
			console.log(error)
			await logEvent(
				'error',
				'Error al actualizar estado reporte.',
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

			const findReport = await ReportService.getById(req.params.id)

			const deleteReport = await ReportService.delete(req?.params?.id, req.user.id, t)
			if (deleteReport.error) return sendResponse(res, deleteReport.code, deleteReport.error)

			await t.commit()

			await logEvent('info', 'Reporte eliminado exitosamente.', { findReport }, req?.user?.id, req)
			return sendResponse(res, 200, 'Reporte eliminado exitosamente.')
		} catch (error) {
			console.log(error)
			await logEvent(
				'error',
				'Error al eliminar reporte.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			await t.rollback()
			return sendResponse(res, 500)
		}
	}

	static async generateReport(req, res) {
		try {
			const {
				timezone = 'America/Guayaquil',
				page = PAGINATION_PAGE,
				limit = '',
				startDate,
				endDate,
				search = '',
				statusReport = '',
				selectedSample = '',
				selectedUsers = '',
			} = req.query

			console.log(req.query)

			const now = moment.tz(timezone)
			const startUTC = startDate
				? moment.tz(startDate, 'YYYY-MM-DD', timezone).startOf('day').utc().toDate()
				: now.clone().startOf('month').utc().toDate()
			const endUTC = endDate
				? moment.tz(endDate, 'YYYY-MM-DD', timezone).endOf('day').utc().toDate()
				: now.clone().endOf('month').utc().toDate()

			// Asignación de título según el valor de statusReport
			let title = 'Informes'
			if (statusReport !== '') {
				if (statusReport === 'true') {
					title = 'Informes - Emitidos'
				} else if (statusReport === 'false') {
					title = 'Informes - No Emitidos'
				}
			}

			if (search) {
				const findReactive = await ReportService.getById(search)
				if (!findReactive) return sendResponse(res, 404, 'No se encontró el informe.')
				title += ` ${findReactive.code}`
			}

			const dataFound = await ReportService.getAll(
				page,
				limit === 'all' ? null : limit,
				search,
				startUTC,
				endUTC,
				selectedSample,
				statusReport,
				selectedUsers
			)

			if (!dataFound || dataFound.reports.length === 0)
				return sendResponse(res, 404, 'No se encontraron informes para generar el reporte.')

			const title_rows = ['Número', 'Código', 'Estado', 'Origen', 'Muestra', 'Responsable', 'Colaborador', 'Fecha']
			const rows = dataFound.reports.map(item => [
				item?.number,
				item?.code,
				item?.isIssued ? 'Emitido' : 'No emitido',
				item?.sample?.quote?.code || item?.sample?.quote?.access?.code,
				item?.sample?.name,
				item?.senior_analyst?.code,
				item?.collaborating_analyst?.code ?? '---',
				formatISOToDate(item?.createdAt),
			])

			const totalRows = dataFound.totalRecords

			const infoU = await system_config_Schema.findOne()
			const institutionData = {
				name: infoU.institution_name,
				address: infoU.address,
				contact: `${infoU.contact_phone}`,
			}

			await logEvent('info', 'Se generó el reporte - Kardex.', null, req.user.id, req)

			const formatDate = date => (date ? moment(date).tz(timezone).format('DD-MM-YYYY') : 'No especificado')
			const pdfFilename = `Reporte_informe_${moment().tz(timezone).format('YYYY-MM-DD_HH-mm')}.pdf`

			await generatePdfTable(
				{
					institutionData,
					title,
					header: {
						dateRange: `Fecha de reporte: ${formatDate(startUTC)} - ${formatDate(endUTC)}`,
						totalRows: `Total de registros: ${totalRows}`,
					},
					title_rows,
					rows,
					filename: pdfFilename,
				},
				res
			)
		} catch (error) {
			await logEvent(
				'error',
				'Error al generar el reporte informes.',
				{ error: error.message, stack: error.stack },
				req.user.id,
				req
			)
			return sendResponse(res, 500)
		}
	}
}
