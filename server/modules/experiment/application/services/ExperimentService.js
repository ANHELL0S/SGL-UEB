import { ExperimentDTO } from '../../domain/dtos/ExperimentDTO.js'
import { ExperimentRepository } from '../repository/ExperimentRepository.js'
import { ExperimentEntity } from '../../domain/entities/ExperimentEntity.js'

export class ExperimentService {
	static async getAll(page, limit, search) {
		const offset = (page - 1) * limit
		const dataFound = await ExperimentRepository.getAll(offset, limit, search)
		return {
			totalRecords: dataFound.count,
			totalPages: Math.ceil(dataFound.count / limit),
			currentPage: parseInt(page, 10),
			recordsPerPage: parseInt(limit, 10),
			experiments: dataFound.rows.map(data => ExperimentDTO.toResponse(data)),
		}
	}

	static async getById(id) {
		const dataFound = await ExperimentRepository.getById(id)
		return ExperimentDTO.toResponse(dataFound)
	}

	static async create(id, data, transaction) {
		const dataFormater = ExperimentEntity.formaterToCreate({ ...data, id })
		return await ExperimentRepository.create(dataFormater, transaction)
	}

	static async update(id, data, transaction) {
		const formaterData = ExperimentEntity.formaterToUpdate({ ...data })
		return await ExperimentRepository.update(id, formaterData, transaction)
	}

	static async changeStatus(id, data, transaction) {
		if (data.hasOwnProperty('status')) data = { ...data, status: !data.status }
		return await ExperimentRepository.update(id, data, transaction)
	}

	static async delete(id, transaction) {
		return await ExperimentRepository.delete(id, transaction)
	}
}
