import { ExperimentDTO } from '../../domain/dtos/ExperimentDTO.js'
import { ParameterRepository } from '../repository/ParameterRepository.js'

export class ParameterService {
	static async getAll(page, limit, search) {
		const offset = (page - 1) * limit
		const dataFound = await ParameterRepository.getAll(offset, limit, search)
		return {
			totalRecords: dataFound.count,
			totalPages: Math.ceil(dataFound.count / limit),
			currentPage: parseInt(page, 10),
			recordsPerPage: parseInt(limit, 10),
			experiments: dataFound.rows.map(data => ExperimentDTO.toResponse(data)),
		}
	}

	static async getById(id) {
		const dataFound = await ParameterRepository.getById(id)
		return ExperimentDTO.toResponse(dataFound)
	}

	static async getAllToAccess(id) {
		const dataFound = await ParameterRepository.getAllToAcess(id)
		return {
			totalRecords: dataFound.count,
			experiments: dataFound.rows.map(data => ExperimentDTO.toResponse(data)),
		}
	}

	static async create(data, transaction) {
		const dataFormater = ExperimentDTO.toCreate({ ...data })
		return await ParameterRepository.create(dataFormater, transaction)
	}

	static async update(id, data, transaction) {
		const formaterData = ExperimentDTO.toUpdate({ ...data })
		return await ParameterRepository.update(id, formaterData, transaction)
	}

	static async changeStatus(id, data, transaction) {
		const formattedData = ExperimentDTO.toChangeStatus(data)
		formattedData.status = !data.status
		return await ParameterRepository.update(id, formattedData, transaction)
	}

	static async delete(id, transaction) {
		await ParameterRepository.update(id, { status: false }, transaction)
		return await ParameterRepository.delete(id, transaction)
	}

	static async restore(id, transaction) {
		await ParameterRepository.update(id, { status: true }, transaction)
		return await ParameterRepository.restore(id, transaction)
	}

	static async deletePermanent(id, transaction) {
		return await ParameterRepository.deletePermanent(id, transaction)
	}
}
