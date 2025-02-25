import moment from 'moment-timezone'
import { system_config_Schema } from '../../../../schema/schemes.js'
import { logEvent } from '../../../../shared/helpers/logger-helper.js'
import { formatISOToDate } from '../../../../shared/utils/time-util.js'
import { generatePdfTable } from '../../../../shared/libs/pdfkitLib.js'
import { RedisCache } from '../../../../shared/services/redis-service.js'
import { REDIS_KEYS } from '../../../../shared/constants/redisKey-const.js'
import { KardexService } from '../../application/services/kardexService.js'
import { sendResponse } from '../../../../shared/helpers/responseHandler-helper.js'
import { PAGINATION_LIMIT, PAGINATION_PAGE } from '../../../../shared/constants/pagination-const.js'

export class KardexController {
	static async getAll(req, res) {
		const { page = PAGINATION_PAGE, limit = PAGINATION_LIMIT, search = '' } = req?.query

		try {
			const dataFound = await KardexService.getAll(page, limit === 'all' ? null : limit, search)
			return sendResponse(res, 200, 'Kardex obtenido exitosamente.', dataFound)
		} catch (error) {
			await logEvent(
				'error',
				'Error al obtener Kardex.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			return sendResponse(res, 500)
		}
	}

	static async getAllPertainToUser(req, res) {
		const { page = PAGINATION_PAGE, limit = PAGINATION_LIMIT, search = '' } = req?.query

		try {
			const dataFound = await KardexService.getAllPertainToUser(
				req.user.id,
				page,
				limit === 'all' ? null : limit,
				search
			)
			return sendResponse(res, 200, 'Kardex obtenido exitosamente.', dataFound)
		} catch (error) {
			await logEvent(
				'error',
				'Error al obtener Kardex.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
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
				movementType = '',
				control_tracking = '',
				selectedUsers = '',
			} = req.query

			const now = moment.tz(timezone)
			const startUTC = startDate
				? moment.tz(startDate, 'YYYY-MM-DD', timezone).startOf('day').utc().toDate()
				: now.clone().startOf('month').utc().toDate()
			const endUTC = endDate
				? moment.tz(endDate, 'YYYY-MM-DD', timezone).endOf('day').utc().toDate()
				: now.clone().endOf('month').utc().toDate()

			let title = 'Kardex'

			if (control_tracking) {
				// Si control_tracking tiene valor, se establece el título correspondiente
				title = 'Kardex - Reactivos sujetos a fiscalización'
				if (search) {
					const findReactive = await KardexService.findReactiveById(search)
					if (!findReactive) return sendResponse(res, 404, 'No se encontró el reactivo.')
					title += ` ${findReactive.name} - ${findReactive.code}`
				}
			} else if (search) {
				const findReactive = await KardexService.findReactiveById(search)
				if (!findReactive) return sendResponse(res, 404, 'No se encontró el reactivo.')
				title += ` ${findReactive.name} - ${findReactive.code}`
			}

			const dataFound = await KardexService.getAll(
				page,
				limit === 'all' ? null : limit,
				search,
				startUTC,
				endUTC,
				movementType,
				control_tracking,
				selectedUsers
			)

			console.log(dataFound)
			if (!dataFound || dataFound.kardex.length === 0)
				return sendResponse(res, 404, 'No se encontraron movimientos para generar el reporte.')

			const title_rows = ['Movimiento', 'Responsable', 'Reactivo', 'Cnt', 'Ud', 'Balance', 'Análisis', 'Nota', 'Fecha']
			const rows = dataFound.kardex.map(item => [
				item?.action_type === 'entry'
					? 'Entrada'
					: item?.action_type === 'adjustment'
					? 'Ajuste'
					: item?.action_type === 'return'
					? 'Salida'
					: '---',
				item?.user?.code ?? '---',
				item?.reactive?.code,
				parseFloat(item?.quantity).toString(),
				item?.reactive?.units_measurement?.unit,
				parseFloat(item?.balance_after_action).toString(),
				item?.analysis?.name ?? '---',
				item?.notes ?? '---',
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
			const pdfFilename = `Reporte_Kardex_${moment().tz(timezone).format('YYYY-MM-DD_HH-mm')}.pdf`

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
				'Error al generar el reporte kardex.',
				{ error: error.message, stack: error.stack },
				req.user.id,
				req
			)
			return sendResponse(res, 500)
		}
	}
}
