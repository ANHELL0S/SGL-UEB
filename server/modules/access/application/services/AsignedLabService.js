import { AsignedLabDTO } from '../../domain/dtos/AsignedLabDTO.js'
import { AsignedLabRepository } from '../repository/AsignedLabRepository.js'

export class AsignedLabService {
	static async getAll(id) {
		const result = await AsignedLabRepository.findAll(id)

		return {
			totalRecords: result.count,
			asigned_labs: result.rows.map(data => AsignedLabDTO.toResponse(data)),
		}
	}

	static async getById(id) {
		const dataFound = await AsignedLabRepository.findById(id)
		return dataFound ? AsignedLabDTO.toResponse(dataFound) : null
	}

	static async create(data, transaction) {
		const formaterData = AsignedLabDTO.toCreate({ ...data })
		await AsignedLabRepository.deletePermanent(formaterData.id_access_fk, transaction)
		return await AsignedLabRepository.create(formaterData, transaction)
	}

	static async deletePermanent(id, transaction) {
		return await AsignedLabRepository.deletePermanent(id, transaction)
	}
}
