import { AnalysisDTO } from '../../domain/dtos/AnalysisDTO.js'
import { AnalysisRepository } from '../repository/AnalysisRepository.js'

export class AnalysisService {
	static async getAll(id) {
		const result = await AnalysisRepository.findAll(id)
		return {
			totalRecords: result.count,
			analysis: result.rows.map(data => AnalysisDTO.toResponse(data)),
		}
	}

	static async getById(id) {
		const dataFound = await AnalysisRepository.findById(id)
		return dataFound ? AnalysisDTO.toResponse(dataFound) : null
	}

	static async create(data, transaction) {
		const formaterData = AnalysisDTO.toCreate({ ...data })
		await AnalysisRepository.deletePermanent(formaterData.id_access_fk, transaction)
		return await AnalysisRepository.create(formaterData, transaction)
	}

	static async deletePermanent(id, transaction) {
		return await AnalysisRepository.deletePermanent(id, transaction)
	}
}
