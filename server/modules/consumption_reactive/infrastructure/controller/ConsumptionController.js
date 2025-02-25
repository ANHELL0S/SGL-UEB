import { db_main } from '../../../../config/db-config.js'
import { logEvent } from '../../../../shared/helpers/logger-helper.js'
import { RedisCache } from '../../../../shared/services/redis-service.js'
import { REDIS_KEYS } from '../../../../shared/constants/redisKey-const.js'
import { sendResponse } from '../../../../shared/helpers/responseHandler-helper.js'
import { ConsumptionService } from '../../application/services/ConsumptionService.js'
import {
	consumption_independent_schema_zod,
	consumption_schema_zod,
	params_schema_zod,
} from '../validators/consumptionSchema.js'
import { PAGINATION_LIMIT, PAGINATION_PAGE } from '../../../../shared/constants/pagination-const.js'

export class ConsumptionController {
	static async getAll(req, res) {
		const { page = PAGINATION_PAGE, limit = PAGINATION_LIMIT, search = '' } = req?.query

		try {
			const dataFound = await ConsumptionService.getAll(page, limit === 'all' ? null : limit, search)
			return sendResponse(res, 200, 'Consumo de reactivos obtenidos exitosamente.', dataFound)
		} catch (error) {
			await logEvent(
				'error',
				'Error al obtener consumo de reactivos.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			return sendResponse(res, 500)
		}
	}

	static async getAllToAccess(req, res) {
		const { page = PAGINATION_PAGE, limit = PAGINATION_LIMIT, search = '' } = req?.query

		try {
			const dataFound = await ConsumptionService.getAllToQuote(
				req.params.id,
				page,
				limit === 'all' ? null : limit,
				search
			)
			return sendResponse(res, 200, 'Consumo obtenidos exitosamente.', dataFound)
		} catch (error) {
			await logEvent(
				'error',
				'Error al obtener los consumo.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			return sendResponse(res, 500)
		}
	}

	static async getAllToUser(req, res) {
		const { page = PAGINATION_PAGE, limit = PAGINATION_LIMIT, search = '' } = req?.query

		try {
			const dataFound = await ConsumptionService.getAllPertainToUser(
				req.user.id,
				page,
				limit === 'all' ? null : limit,
				search
			)
			return sendResponse(res, 200, 'Consumo obtenidos exitosamente.', dataFound)
		} catch (error) {
			await logEvent(
				'error',
				'Error al obtener los consumo.',
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
			const parsedData = consumption_schema_zod.safeParse(req.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const newdata = {
				...req.body,
				user: req.user.id,
			}

			const newData = await ConsumptionService.create(newdata, t)
			if (newData.error) return sendResponse(res, newData.code, newData.error)

			await t.commit()

			await logEvent('info', 'Conusmo registrado exitosamente.', { newData }, req?.user?.id, req)
			return sendResponse(res, 201, 'Conusmo registrado exitosamente.', newData)
		} catch (error) {
			await logEvent(
				'error',
				'Error al crear conusmo.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			await t.rollback()
			return sendResponse(res, 500)
		}
	}

	static async createIndependent(req, res) {
		const t = await db_main.transaction()

		try {
			const parsedData = consumption_independent_schema_zod.safeParse(req.body)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const newdata = {
				...req.body,
				user: req.user.id,
			}

			const newData = await ConsumptionService.createIndependent(newdata, t)
			if (newData.error) return sendResponse(res, newData.code, newData.error)

			await t.commit()

			await logEvent('info', 'Consumo registrado exitosamente.', { newData }, req?.user?.id, req)
			return sendResponse(res, 201, 'Consumo registrado exitosamente.', newData)
		} catch (error) {
			console.log(error)
			await logEvent(
				'error',
				'Error al crear consumo.',
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

			const isCreatedResult = await ConsumptionService.isCreateConsumed(req?.params?.id, req.user.id)
			if (isCreatedResult.error) return sendResponse(res, isCreatedResult.code, isCreatedResult.error)

			const deletedConsumtion = await ConsumptionService.delete(isCreatedResult?.id_consumption_reactive, t)
			if (deletedConsumtion.error) return sendResponse(res, deletedConsumtion.code, deletedConsumtion.error)

			await t.commit()

			await logEvent('info', 'Consumo eliminado exitosamente.', { isCreatedResult }, req?.user?.id, req)
			return sendResponse(res, 200, 'Consumo eliminado exitosamente.')
		} catch (error) {
			await logEvent(
				'error',
				'Error al eliminar el Consumo.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			await t.rollback()
			return sendResponse(res, 500)
		}
	}

	static async deleteIndependent(req, res) {
		const t = await db_main.transaction()
		try {
			const parsedParams = params_schema_zod.safeParse(req?.params)
			if (!parsedParams.success) return sendResponse(res, 400, parsedParams.error.errors[0].message)

			const isCreatedResult = await ConsumptionService.isCreateConsumed(req?.params?.id, req.user.id)
			if (isCreatedResult.error) return sendResponse(res, isCreatedResult.code, isCreatedResult.error)

			const deletedConsumtion = await ConsumptionService.deleteIndependent(isCreatedResult?.id_consumption_reactive, t)
			if (deletedConsumtion.error) return sendResponse(res, deletedConsumtion.code, deletedConsumtion.error)

			await t.commit()

			await logEvent('info', 'Consumo eliminado exitosamente.', { isCreatedResult }, req?.user?.id, req)
			return sendResponse(res, 200, 'Consumo eliminado exitosamente.')
		} catch (error) {
			await logEvent(
				'error',
				'Error al eliminar el Consumo.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			await t.rollback()
			return sendResponse(res, 500)
		}
	}
}
