import {
	user_Schema,
	kardex_Schema,
	quotes_Scheme,
	reactive_Schema,
	consumptionReactive_Schema,
	access_Scheme,
	experiments_parameter_Scheme,
} from '../../../../schema/schemes.js'
import { ConsumptionDTO } from '../../domain/dtos/ConsumptionDTO.js'
import { KARDEX } from '../../../../shared/constants/kardexValues-const.js'
import { ConsumptionRepository } from '../repository/ConsumptionRepository.js'

export class ConsumptionService {
	static async getAll(page, limit, search) {
		const offset = limit ? (page - 1) * limit : null
		const result = await ConsumptionRepository.findAll(offset, limit, search)

		return {
			totalRecords: result.count,
			totalPages: limit ? Math.ceil(result.count / limit) : 1,
			currentPage: limit ? parseInt(page, 10) : 1,
			recordsPerPage: limit ? parseInt(limit, 10) : result.count,
			consumption: result.rows.map(data => ConsumptionDTO.toResponse(data)),
		}
	}

	static async getAllToQuote(id, page, limit, search) {
		const offset = limit ? (page - 1) * limit : null
		const result = await ConsumptionRepository.findAlltoQuote(id, offset, limit, search)

		return {
			totalRecords: result.count,
			totalPages: limit ? Math.ceil(result.count / limit) : 1,
			currentPage: limit ? parseInt(page, 10) : 1,
			recordsPerPage: limit ? parseInt(limit, 10) : result.count,
			consumption: result.rows.map(data => ConsumptionDTO.toResponse(data)),
		}
	}

	static async getAllPertainToUser(id, page, limit, search) {
		const offset = limit ? (page - 1) * limit : null
		const result = await ConsumptionRepository.findAllPertaintoUser(id, offset, limit, search)

		return {
			totalRecords: result.count,
			totalPages: limit ? Math.ceil(result.count / limit) : 1,
			currentPage: limit ? parseInt(page, 10) : 1,
			recordsPerPage: limit ? parseInt(limit, 10) : result.count,
			consumption: result.rows.map(data => ConsumptionDTO.toResponse(data)),
		}
	}

	static async getById(id) {
		const dataFound = await ConsumptionRepository.findById(id)
		return dataFound ? ConsumptionDTO.toResponse(dataFound) : null
	}

	static async create(data, transaction) {
		const formaterData = ConsumptionDTO.toCreate(data)

		const findQuote = await quotes_Scheme.findByPk(formaterData.id_quote_fk)
		if (!findQuote) return { code: 404, error: 'Cotización no encontrado.' }

		if (!findQuote && !findQuote.code) {
			const findAccess = await access_Scheme.findOne({ where: { id_quote_fk: findQuote.id_quote } })
			if (!findAccess) return { code: 404, error: 'Acceso no encontrado.' }
		}

		const findAccess = await access_Scheme.findOne({ where: { id_quote_fk: findQuote.id_quote } })

		const findAnalysis = await experiments_parameter_Scheme.findByPk(formaterData.id_analysis_fk)
		if (!findAnalysis) return { code: 404, error: 'Análsis no encontrado.' }

		const findUser = user_Schema.findByPk(formaterData.id_analyst_fk)
		if (!findUser) return { code: 404, error: 'Usuario no encontrado.' }

		const findReactive = await reactive_Schema.findByPk(formaterData.id_reactive_fk)
		if (!findReactive) return { code: 404, error: 'Reactivo no encontrado.' }

		if (formaterData.amount === 0) {
			return {
				code: 400,
				error: 'El consumo no puede ser 0',
			}
		}

		if (formaterData.amount > findReactive.current_quantity)
			return {
				code: 404,
				error: `El consumo ${formaterData.amount} excede la cantidad disponible de ${parseFloat(
					findReactive.current_quantity
				).toString()}`,
			}

		const newQuantity = findReactive.current_quantity - formaterData.amount

		await reactive_Schema.update(
			{ current_quantity: newQuantity },
			{ where: { id_reactive: formaterData.id_reactive_fk }, transaction }
		)

		const newConsumption = await ConsumptionRepository.create(formaterData, transaction)

		await kardex_Schema.create(
			{
				action_type: KARDEX.RETURN,
				id_analysis_fk: formaterData.id_analysis_fk,
				id_reactive_fk: formaterData.id_reactive_fk,
				id_responsible: formaterData.id_analyst_fk,
				id_consumption_fk: newConsumption?.id_consumption_reactive,
				quantity: formaterData.amount,
				balance_after_action: newQuantity,
				notes: `Usado en ${findQuote.code ?? findAccess.code}`,
			},
			{ transaction }
		)

		return newConsumption
	}

	static async createIndependent(data, transaction) {
		const formaterData = ConsumptionDTO.toCreate(data)

		const findAnalysis = await experiments_parameter_Scheme.findByPk(formaterData.id_analysis_fk)
		if (!findAnalysis) return { code: 404, error: 'Análsis no encontrado.' }

		const findUser = user_Schema.findByPk(formaterData.id_analyst_fk)
		if (!findUser) return { code: 404, error: 'Usuario no encontrado.' }

		const findReactive = await reactive_Schema.findByPk(formaterData.id_reactive_fk)
		if (!findReactive) return { code: 404, error: 'Reactivo no encontrado.' }

		if (formaterData.amount === 0) {
			return {
				code: 400,
				error: 'El consumo no puede ser 0',
			}
		}

		if (formaterData.amount > findReactive.current_quantity)
			return {
				code: 404,
				error: `El consumo ${formaterData.amount} excede la cantidad disponible de ${parseFloat(
					findReactive.current_quantity
				).toString()}`,
			}

		const newQuantity = findReactive.current_quantity - formaterData.amount

		await reactive_Schema.update(
			{ current_quantity: newQuantity },
			{ where: { id_reactive: formaterData.id_reactive_fk }, transaction }
		)

		const newConsumption = await ConsumptionRepository.create(formaterData, transaction)

		await kardex_Schema.create(
			{
				action_type: KARDEX.RETURN,
				id_analysis_fk: formaterData.id_analysis_fk,
				id_reactive_fk: formaterData.id_reactive_fk,
				id_consumption_fk: newConsumption?.id_consumption_reactive,
				id_responsible: formaterData.id_analyst_fk,
				quantity: formaterData.amount,
				balance_after_action: newQuantity,
				notes: formaterData?.notes,
				isIndependent: true,
			},
			{ transaction }
		)

		return newConsumption
	}

	static async isCreateConsumed(id, user) {
		const consumption = await consumptionReactive_Schema.findByPk(id)

		if (!consumption) return { code: 404, error: 'Consumo no encontrado.' }
		if (consumption.id_analyst_fk !== user) return { code: 400, error: 'No eres el responsable de este consumo.' }

		return consumption
	}

	static async delete(id, transaction) {
		const consumption = await consumptionReactive_Schema.findByPk(id)
		if (!consumption) return { code: 404, error: 'Consumo no encontrado.' }

		const findQuote = await quotes_Scheme.findByPk(consumption.id_quote_fk)
		if (!findQuote) return { code: 404, error: 'Cotización no encontrada.' }

		// Usamos la propiedad "code" de findQuote si existe.
		let quoteCode = findQuote.code

		// Si no hay código en la cotización, intentamos obtenerlo del acceso relacionado.
		if (!quoteCode) {
			const findAccess = await access_Scheme.findOne({ where: { id_quote_fk: findQuote.id_quote } })
			if (!findAccess || !findAccess.code) return { code: 404, error: 'Acceso no encontrado.' }
			quoteCode = findAccess.code
		}

		const findReactive = await reactive_Schema.findByPk(consumption.id_reactive_fk)
		if (!findReactive) return { code: 404, error: 'Reactivo no encontrado.' }

		const newQuantity = findReactive.current_quantity + consumption.amount

		await reactive_Schema.update(
			{ current_quantity: newQuantity },
			{ where: { id_reactive: consumption.id_reactive_fk }, transaction }
		)

		await kardex_Schema.create(
			{
				id_reactive_fk: consumption.id_reactive_fk,
				id_analysis_fk: consumption.id_analysis_fk,
				action_type: KARDEX.ADJUSTMENT,
				id_responsible: consumption.id_analyst_fk,
				quantity: consumption.amount,
				balance_after_action: newQuantity,
				notes: `Eliminado consumo en ${quoteCode}`,
			},
			{ transaction }
		)

		return await ConsumptionRepository.delete(id, transaction)
	}

	static async deleteIndependent(id, transaction) {
		const consumption = await consumptionReactive_Schema.findByPk(id)
		if (!consumption) return { code: 404, error: 'Consumo no encontrado.' }

		const findReactive = await reactive_Schema.findByPk(consumption.id_reactive_fk)
		if (!findReactive) return { code: 404, error: 'Reactivo no encontrado.' }

		const newQuantity = findReactive.current_quantity + consumption.amount

		await reactive_Schema.update(
			{ current_quantity: newQuantity },
			{ where: { id_reactive: consumption.id_reactive_fk }, transaction }
		)

		const findKardexPertaintoConcumption = await kardex_Schema.findOne({
			where: { id_consumption_fk: consumption?.id_consumption_reactive },
		})

		await kardex_Schema.create(
			{
				id_reactive_fk: consumption.id_reactive_fk,
				id_analysis_fk: consumption.id_analysis_fk,
				action_type: KARDEX.ADJUSTMENT,
				id_responsible: consumption.id_analyst_fk,
				quantity: consumption.amount,
				balance_after_action: newQuantity,
				notes: `Eliminado consumo de ${findKardexPertaintoConcumption?.notes} `,
			},
			{ transaction }
		)

		return await ConsumptionRepository.delete(id, transaction)
	}
}
