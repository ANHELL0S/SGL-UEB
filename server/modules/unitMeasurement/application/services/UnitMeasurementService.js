import { UnitMeasurementDTO } from '../../domain/dtos/UnitMeasurementDTO.js'
import { UnitMeasurementRepository } from '../repository/UnitMeasurementRepository.js'

export class UnitMeasurementService {
	static async getAll(page, limit, search) {
		const offset = limit ? (page - 1) * limit : null
		const result = await UnitMeasurementRepository.findAll(offset, limit, search)

		return {
			totalRecords: result.count,
			totalPages: limit ? Math.ceil(result.count / limit) : 1,
			currentPage: limit ? parseInt(page, 10) : 1,
			recordsPerPage: limit ? parseInt(limit, 10) : result.count,
			units_measurement: result.rows.map(lab =>
				UnitMeasurementDTO.toResponse(lab) ? UnitMeasurementDTO.toResponse(lab) : null
			),
		}
	}

	static async getById(id) {
		const dataFound = await UnitMeasurementRepository.findById(id)
		return dataFound ? UnitMeasurementDTO.toResponse(dataFound) : null
	}

	static async create(data, transaction) {
		const existingName = await UnitMeasurementRepository.findLabByField('name', data.name)
		if (existingName) return { error: 'El nombre ya está en uso.' }

		const labData = UnitMeasurementDTO.transformData({ ...data })
		const createdUser = await UnitMeasurementRepository.create(labData, transaction)
		return { unit_measurement: createdUser }
	}

	static async update(id, data, transaction) {
		const existingName = await UnitMeasurementRepository.findLabByFieldExcept('name', data.name, id)
		if (existingName) return { error: 'El nombre ya está en uso.' }
		const labData = UnitMeasurementDTO.transformData({ ...data })
		const updatedLab = await UnitMeasurementRepository.update(id, labData, transaction)

		return { lab: updatedLab }
	}

	static async delete(id, transaction) {
		await UnitMeasurementRepository.findById(id)
		return UnitMeasurementRepository.delete(id, transaction)
	}
}
