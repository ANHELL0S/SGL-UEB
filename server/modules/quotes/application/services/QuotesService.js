import { QuoteDTO } from '../../domain/dtos/QuoteDTO.js'
import { QuoteRepository } from '../repository/QuoteRepository.js'
import { UserDTO } from '../../domain/dtos/UserDTO.js'
import { quotes_Scheme, system_config_Schema } from '../../../../schema/schemes.js'
import { Op } from 'sequelize'

export class QuotesService {
	static async getAll(page, limit, search) {
		const offset = limit ? (page - 1) * limit : null
		const result = await QuoteRepository.findAll(offset, limit, search)

		return {
			totalRecords: result.count,
			totalPages: limit ? Math.ceil(result.count / limit) : 1,
			currentPage: limit ? parseInt(page, 10) : 1,
			recordsPerPage: limit ? parseInt(limit, 10) : result.count,
			quotes: result.rows.map(lab => QuoteDTO.toResponse(lab)),
		}
	}

	static async getById(id) {
		const dataFound = await QuoteRepository.findById(id)
		return dataFound ? QuoteDTO.toResponse(dataFound) : null
	}

	static async getAllPertainToAnalyst(id, page, limit, search) {
		const offset = limit ? (page - 1) * limit : null
		const result = await QuoteRepository.findAllQuotesByUserId(id, offset, limit, search)

		return {
			totalRecords: result.count,
			totalPages: limit ? Math.ceil(result.count / limit) : 1,
			currentPage: limit ? parseInt(page, 10) : 1,
			recordsPerPage: limit ? parseInt(limit, 10) : result.count,
			quotes: result.rows.map(lab => QuoteDTO.toResponse(lab)),
		}
	}

	static async getByCode(code) {
		const findData = await QuoteRepository.findQuoteByCode(code)
		if (!findData) return { code: 404, error: 'Cotización no encontrada.' }
		return findData ? QuoteDTO.toResponse(findData) : null
	}

	static async findToDirector() {
		const result = await QuoteRepository.findToDirector()
		return {
			users: result.rows.map(data => UserDTO.toResponse(data)),
		}
	}

	static async create(data, transaction) {
		const createdAtDate = new Date()

		const dateCode = `${createdAtDate.getFullYear().toString().slice(2)}${(createdAtDate.getMonth() + 1)
			.toString()
			.padStart(2, '0')}${createdAtDate.getDate().toString().padStart(2, '0')}`

		// 1. Se obtiene la configuración del sistema para extraer el valor predeterminado de secuence_quote
		const configRecord = await system_config_Schema.findOne()
		const defaultSequence = configRecord ? configRecord.secuence_quote.toString().padStart(6, '0') : '000005'

		// 2. Se consulta la tabla de cotizaciones para ver si existe algún registro (quotes_Scheme es el modelo de cotizaciones)
		const lastQuote = await quotes_Scheme.findOne({
			where: {
				code: {
					[Op.ne]: null,
				},
			},
			order: [['createdAt', 'DESC']],
		})

		let secuenceCode
		if (!lastQuote && !lastQuote?.code) {
			// Si no hay registro en cotizaciones, se usa el valor de la configuración.
			secuenceCode = defaultSequence
		} else {
			// Si ya existe una cotización, se extrae la parte secuencial del código del último registro.
			// Se asume que el formato es "COT_YYMMDD_XXXXXX"
			const parts = lastQuote?.code?.split('_')
			const lastSequence = parts[2] // Por ejemplo, "000005"
			// Se suma 1 al valor numérico y se vuelve a formatear con ceros a la izquierda.
			const newSequenceNumber = parseInt(lastSequence, 10) + 1
			secuenceCode = newSequenceNumber.toString().padStart(lastSequence.length, '0')
		}

		// Se forma el código de pago utilizando la fecha y la secuencia determinada.
		const paymentCode = `COT_${dateCode}_${secuenceCode}`

		const formaterData = QuoteDTO.toCreate({ ...data, code: paymentCode })
		return await QuoteRepository.createQuote(formaterData, transaction)
	}

	static async update(id, data, transaction) {
		const uptData = QuoteDTO.toCreate({ ...data })
		const newData = await QuoteRepository.update(id, uptData, transaction)
		return { quote: newData }
	}

	static async changeStatus(id, data, transaction) {
		const uptData = QuoteDTO.toUpdate({ ...data })
		return await QuoteRepository.changeStatus(id, uptData, transaction)
	}

	static async delete(id, transaction) {
		return await QuoteRepository.delete(id, transaction)
	}

	static async restore(id, transaction) {
		return await QuoteRepository.restore(id, transaction)
	}

	static async deletePermanent(id, transaction) {
		return await QuoteRepository.deletePermanent(id, transaction)
	}
}
