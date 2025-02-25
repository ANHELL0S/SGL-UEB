import { sample_Schema, sampleResult_Schema, user_Schema } from '../../../../schema/schemes.js'
import { ResultDTO } from '../../domain/dtos/ResultDTO.js'
import { ResultRepository } from '../repository/ResultRepository.js'

export class ResultService {
	static async getAll(page, limit, search) {
		const offset = limit ? (page - 1) * limit : null
		const result = await ResultRepository.findAll(offset, limit, search)

		return {
			totalRecords: result.count,
			totalPages: limit ? Math.ceil(result.count / limit) : 1,
			currentPage: limit ? parseInt(page, 10) : 1,
			recordsPerPage: limit ? parseInt(limit, 10) : result.count,
			samples: result.rows.map(data => ResultDTO.toResponse(data)),
		}
	}

	static async getAllToSample(id, page, limit, search) {
		const offset = limit ? (page - 1) * limit : null
		const result = await ResultRepository.findAlltoSample(id, offset, limit, search)

		return {
			totalRecords: result.count,
			totalPages: limit ? Math.ceil(result.count / limit) : 1,
			currentPage: limit ? parseInt(page, 10) : 1,
			recordsPerPage: limit ? parseInt(limit, 10) : result.count,
			samples: result.rows.map(data => ResultDTO.toResponse(data)),
		}
	}

	static async create(data, transaction) {
		const formaterData = ResultDTO.toCreate(data)

		const findUser = await user_Schema.findByPk(formaterData.id_analyst_fk)
		if (!findUser) return { code: 404, error: 'Usuario no encontrado.' }

		const lastSample = await sampleResult_Schema.findOne({
			order: [['code_assigned_ueb', 'DESC']],
			attributes: ['code_assigned_ueb'],
			transaction,
		})
		const newCodeAssignedUeb = lastSample ? lastSample.code_assigned_ueb + 1 : 120
		const formattedDataWithSample = {
			...formaterData,
			code_assigned_ueb: newCodeAssignedUeb,
		}

		return await ResultRepository.create(formattedDataWithSample, transaction)
	}

	static async update(id, data, transaction) {
		const dataFormater = ResultDTO.toUpdate({ ...data })

		const findResult = await sampleResult_Schema.findByPk(id)
		if (!findResult) return { code: 404, error: 'Resultado de muestra no encontrado.' }

		const findUser = await user_Schema.findByPk(dataFormater.id_analyst_fk)
		if (!findUser) return { code: 404, error: 'Usuario no encontrado.' }

		if (!findResult || findResult.id_analyst_fk !== dataFormater.id_analyst_fk)
			return { code: 403, error: 'No eres el responsable de este resultado.' }

		return await ResultRepository.update(id, dataFormater, transaction)
	}

	static async isCratedResult(id, user) {
		const findResult = await sampleResult_Schema.findByPk(id)
		if (!findResult) return { code: 404, error: 'Resultado no encontrado.' }
		if (findResult.id_analyst_fk !== user) return { code: 400, error: 'No eres el responsable de este resultado.' }
	}

	static async delete(id, transaction) {
		return await ResultRepository.delete(id, transaction)
	}
}
