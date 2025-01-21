import { Op } from 'sequelize'
import moment from 'moment-timezone'
import {
	lab_schema_zod,
	params_schema_zod,
	lab_status_schema_zod,
	assign_analyst_lab_zod,
} from '../../validators/labSchema.js'
import { db_main } from '../../../../config/db-config.js'
import { LabService } from '../../application/services/labService.js'
import { logEvent } from '../../../../shared/helpers/logger-helper.js'
import { generatePdfTable } from '../../../../shared/libs/pdfkitLib.js'
import { RedisCache } from '../../../../shared/services/redis-service.js'
import { REDIS_KEYS } from '../../../../shared/constants/redisKey-const.js'
import { sendResponse } from '../../../../shared/helpers/responseHandler-helper.js'
import { system_config_Schema, laboratory_Schema } from '../../../../schema/schemes.js'
import { PAGINATION_LIMIT, PAGINATION_PAGE } from '../../../../shared/constants/pagination-const.js'

export class LabController {
	static async getAll(req, res) {
		const { page = PAGINATION_PAGE, limit = PAGINATION_LIMIT, search = '' } = req?.query
		const cacheKey = `cache:${REDIS_KEYS.LABS.LAB}:page:${page}:limit:${limit}:search:${search}`

		try {
			const usersCache = await RedisCache.getFromCache(cacheKey)
			if (usersCache) return sendResponse(res, 200, 'Laboratorios obtenidos exitosamente.', usersCache)

			const labsFound = await LabService.getAllLabs(page, limit === 'all' ? null : limit, search)
			await RedisCache.setInCache(cacheKey, labsFound)

			return sendResponse(res, 200, 'Laboratorios obtenidos exitosamente.', labsFound)
		} catch (error) {
			await logEvent(
				'error',
				'Error al obtener los laboratorios.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			return sendResponse(res, 500)
		}
	}

	static async getById(req, res) {
		const cacheKey = `cache:${REDIS_KEYS.LABS.LAB}:${req?.params?.id}`

		try {
			const parsedData = params_schema_zod.safeParse(req?.params)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const cachedUser = await RedisCache.getFromCache(cacheKey)
			if (cachedUser) return sendResponse(res, 200, 'Laboratorio obtenido exitosamente.', cachedUser)

			const userFound = await LabService.getLabById(req?.params?.id)
			if (!userFound) return sendResponse(res, 404, 'Laboratorio no encontrado.')

			await RedisCache.setInCache(cacheKey, userFound)

			return sendResponse(res, 200, 'Laboratorio obtenido exitosamente.', userFound)
		} catch (error) {
			await logEvent(
				'error',
				'Error al obtener el laboratorio.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			return sendResponse(res, 500)
		}
	}

	static async findToName(req, res) {
		const cacheKey = `cache:${REDIS_KEYS.LABS.LAB}:${req?.params?.name}`

		try {
			const cachedData = await RedisCache.getFromCache(cacheKey)
			if (cachedData) return sendResponse(res, 200, 'Laboratorio obtenido exitosamente.', cachedData)

			const dataFound = await LabService.findToName(req?.params?.name)
			if (!dataFound) return sendResponse(res, 404, 'Laboratorio no encontrado.')
			await RedisCache.setInCache(cacheKey, dataFound)

			return sendResponse(res, 200, 'Laboratorio obtenido exitosamente.', dataFound)
		} catch (error) {
			await logEvent(
				'error',
				'Error al obtener el laboratorio.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			return sendResponse(res, 500)
		}
	}

	static async create(req, res) {
		const t = await db_main.transaction()
		const cacheKey = `cache:${REDIS_KEYS.LABS.LAB}:*`

		try {
			const parsedData = lab_schema_zod.safeParse(req.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const result = await LabService.createLab(req.body, t)
			if (result.error) return sendResponse(res, 400, result.error)

			await t.commit()

			await RedisCache.clearCache(cacheKey)

			await logEvent('info', 'Laboratorio creado exitosamente.', { result }, req?.user?.id, req)
			return sendResponse(res, 201, 'Laboratorio creado exitosamente.', result)
		} catch (error) {
			console.log(error)
			await logEvent(
				'error',
				'Error al crear el laboratorio.',
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
		const cacheKey = `cache:${REDIS_KEYS.LABS.LAB}:*`

		try {
			const parsedParams = params_schema_zod.safeParse(req.params)
			if (!parsedParams.success) return sendResponse(res, 400, parsedParams.error.errors[0].message)

			const parsedData = lab_schema_zod.safeParse(req.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const labFound = await LabService.getLabById(req?.params?.id)
			if (!labFound) return sendResponse(res, 404, 'Laboratorio no encontrado.')

			const labData = await LabService.updateLab(req?.params?.id, req.body, t)
			if (labData.error) return sendResponse(res, 400, labData.error)

			await RedisCache.clearCache(cacheKey)
			await t.commit()

			await logEvent('info', 'Laboratorio actualizado exitosamente.', { labData }, req?.user?.id, req)
			return sendResponse(res, 200, 'Laboratorio actualizado exitosamente.')
		} catch (error) {
			await logEvent(
				'error',
				'Error al actualizar laboratorio.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			await t.rollback()
			return sendResponse(res, 500)
		}
	}

	static async assignAnalyst(req, res) {
		const t = await db_main.transaction()
		const cacheKey = `cache:${REDIS_KEYS.LABS.LAB}:*`

		try {
			const parsedData = assign_analyst_lab_zod.safeParse(req.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const assignAnalystLabData = await LabService.assignAnalystLab(req.body, t)
			if (assignAnalystLabData.error) return sendResponse(res, assignAnalystLabData.status, assignAnalystLabData.error)

			await RedisCache.clearCache(cacheKey)
			await t.commit()

			await logEvent('info', 'Analista asignado exitosamente.', { assignAnalystLabData }, req.user.id, req)
			return sendResponse(res, 201, 'Analista asignado exitosamente.', assignAnalystLabData)
		} catch (error) {
			await logEvent(
				'error',
				'Error al asignar analista al laboratorio.',
				{ error: error.message, stack: error.stack },
				user.id,
				req
			)
			await t.rollback()
			return sendResponse(res, 500)
		}
	}

	static async removeAssignAnalyst(req, res) {
		const t = await db_main.transaction()
		const cacheKey = `cache:${REDIS_KEYS.LABS.LAB}:*`

		try {
			const parsedParams = params_schema_zod.safeParse(req.params)
			if (!parsedParams.success) return sendResponse(res, 400, parsedParams.error.errors[0].message)

			const assignAnalystLabData = await LabService.removeAssignAnalystLab(req.params.id, t)
			if (assignAnalystLabData.error) return sendResponse(res, assignAnalystLabData.status, assignAnalystLabData.error)

			await RedisCache.clearCache(cacheKey)
			await t.commit()

			await logEvent('info', 'Analista asignado exitosamente.', { assignAnalystLabData }, req.user.id, req)
			return sendResponse(res, 201, 'Analista asignado exitosamente.', assignAnalystLabData)
		} catch (error) {
			await logEvent(
				'error',
				'Error al asignar analista al laboratorio.',
				{ error: error.message, stack: error.stack },
				req.user.id,
				req
			)
			await t.rollback()
			return sendResponse(res, 500)
		}
	}

	static async changeStatus(req, res) {
		const t = await db_main.transaction()
		const cacheKey = `cache:${REDIS_KEYS.LABS.LAB}:*`

		try {
			const parsedParams = params_schema_zod.safeParse(req?.params)
			if (!parsedParams.success) return sendResponse(res, 400, parsedParams.error.errors[0].message)

			const parsedData = lab_status_schema_zod.safeParse(req?.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const userFound = await LabService.getLabById(req?.params?.id)
			if (!userFound) return sendResponse(res, 404, 'Laboratorio no encontrado.')

			const userData = await LabService.changeStatusLab(req?.params?.id, req.body, t)

			await RedisCache.clearCache(cacheKey)
			await t.commit()

			await logEvent('info', 'Estado de laboratorio actualizado exitosamente.', { userData }, req?.user?.id, req)
			return sendResponse(res, 200, 'Estado de laboratorio actualizado exitosamente.')
		} catch (error) {
			await logEvent(
				'error',
				'Error al actualizar el estado del laboratorio.',
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
		const cacheKey = `cache:${REDIS_KEYS.LABS.LAB}:*`

		try {
			const parsedParams = params_schema_zod.safeParse(req?.params)
			if (!parsedParams.success) return sendResponse(res, 400, parsedParams.error.errors[0].message)

			const userFound = await LabService.getLabById(req?.params?.id)
			if (!userFound) return sendResponse(res, 404, 'Laboratorio no encontrado.')

			const labData = await LabService.deleteLab(req?.params?.id, t)
			if (labData.error) return sendResponse(res, 400, labData.error)

			await RedisCache.clearCache(cacheKey)
			await t.commit()

			await logEvent('info', 'Laboratorio eliminado exitosamente.', { labData }, req?.user?.id, req)
			return sendResponse(res, 200, 'Laboratorio eliminado exitosamente.')
		} catch (error) {
			await logEvent(
				'error',
				'Error al eliminar el laboratorio.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			await t.rollback()
			return sendResponse(res, 500)
		}
	}

	static async generatePdfReport(req, res) {
		try {
			const { startDate, endDate, timezone = 'America/Guayaquil' } = req.query

			const now = moment.tz(timezone)
			const startUTC = startDate
				? moment.tz(startDate, 'YYYY-MM-DD', timezone).startOf('day').utc().toDate()
				: now.clone().startOf('month').utc().toDate()
			const endUTC = endDate
				? moment.tz(endDate, 'YYYY-MM-DD', timezone).endOf('day').utc().toDate()
				: now.clone().endOf('month').utc().toDate()

			const consumptions = await laboratory_Schema.findAll({
				where: {
					createdAt: {
						[Op.gte]: startUTC,
						[Op.lte]: endUTC,
					},
				},
				order: [['createdAt', 'DESC']],
			})

			if (!consumptions.length)
				return sendResponse(res, 404, 'No se encontraron registros de laboratorios para generar el reporte.')

			const title_rows = ['Nombre', 'Ubicación', 'Descripción', 'Estado', 'Fecha']
			const rows = consumptions.map(item => [
				item.name,
				item.location,
				item.description,
				item.active ? 'Habilitado' : 'Deshabilitado',
				moment(item.createdAt).tz(timezone).format('DD-MM-YYYY HH:mm'),
			])

			const totalRows = consumptions.length

			const infoU = await system_config_Schema.findOne()
			const institutionData = {
				name: infoU.institution_name,
				address: infoU.address,
				contact: `${infoU.contact_phone} | ${infoU.contact_email}`,
			}

			await logEvent('info', 'Se generó un reporte PDF de laboratorios.', null, req.user.id, req)

			const formatDate = date => (date ? moment(date).tz(timezone).format('DD-MM-YYYY') : 'No especificado')

			await generatePdfTable(
				{
					institutionData,
					title: 'Reporte de laboratorios.',
					header: {
						dateRange: `Fecha de reporte: ${formatDate(startUTC)} - ${formatDate(endUTC)}`,
						totalRows: `Total de registros: ${totalRows}`,
					},
					title_rows,
					rows,
					filename: `Reporte_Laboratorios_${moment().tz(timezone).format('YYYY-MM-DD_HH-mm')}.pdf`,
				},
				res
			)
		} catch (error) {
			console.log(error)
			await logEvent(
				'error',
				'Error al generar el reporte PDF de consumo de reactivos.',
				{ error: error.message, stack: error.stack },
				req.user.id,
				req
			)
			return sendResponse(res, 500)
		}
	}
}
