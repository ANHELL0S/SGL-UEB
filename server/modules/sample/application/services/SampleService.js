import { SampleDTO } from '../../domain/dtos/SampleDTO.js'
import { SecuenceReportDTO } from '../../domain/dtos/SecuenceReportDTO.js'
import { SampleRepository } from '../repository/SampleRepository.js'

export class SampleService {
	static async getAll(page, limit, search) {
		const offset = limit ? (page - 1) * limit : null
		const result = await SampleRepository.findAll(offset, limit, search)

		return {
			totalRecords: result.count,
			totalPages: limit ? Math.ceil(result.count / limit) : 1,
			currentPage: limit ? parseInt(page, 10) : 1,
			recordsPerPage: limit ? parseInt(limit, 10) : result.count,
			samples: result.rows.map(data => SampleDTO.toResponse(data)),
		}
	}

	static async getAllToQuote(id) {
		const result = await SampleRepository.findAlltoQuote(id)

		return {
			totalRecords: result.count,
			samples: result.rows.map(data => SampleDTO.toResponse(data)),
		}
	}

	static async getById(id) {
		const dataFound = await SampleRepository.findById(id)
		return dataFound ? SampleDTO.toResponse(dataFound) : null
	}

	static async create(data, transaction) {
		const formaterData = SampleDTO.toCreate(data)
		return await SampleRepository.create(formaterData, transaction)
	}

	static async update(id, data, transaction) {
		const dataFormater = SampleDTO.toUpdate({ ...data })
		const findData = await SampleRepository.findById(id)
		if (!findData) return { code: 404, error: 'Muestra no encontrada.' }
		if (findData.user.id_user !== dataFormater.id_analyst_fk)
			return { code: 403, error: 'No eres el responsable de esta muestra.' }

		return await SampleRepository.update(id, dataFormater, transaction)
	}

	static async isCratedSample(id, user) {
		const findSample = await SampleRepository.findById(id)
		if (!findSample) return { code: 404, error: 'Muestra no encontrada.' }

		if (findSample.user.id_user !== user) return { code: 403, error: 'No eres el responsable de esta muestra.' }

		return findSample
	}

	static async createSecuenceReport(data, transaction) {
		// Formatear los datos de entrada utilizando el DTO correspondiente
		const formaterData = SecuenceReportDTO.toCreate({ ...data })

		// Buscar el último reporte existente
		const lastReport = await SampleRepository.findLastReport(transaction)

		// Determinar el nuevo número:
		// Si no existe ningún registro, se asigna 154, de lo contrario se toma el último número y se suma 1.
		const newNumber = lastReport ? lastReport.number + 1 : 154
		const currentYear = new Date().getFullYear()
		const generateSecuenceCode = `${newNumber}-${currentYear}`

		// Crear el reporte asignándole el número y código calculados.
		// Se asume que el método createReport permite asignar manualmente el campo number.
		return await SampleRepository.createReport(
			{ ...formaterData, number: newNumber, code: generateSecuenceCode },
			transaction
		)
	}

	static async delete(id, transaction) {
		return await SampleRepository.delete(id, transaction)
	}
}
