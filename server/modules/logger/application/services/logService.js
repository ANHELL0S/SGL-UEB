import { LogDTO } from '../../domain/dtos/logDTO.js'
import { LogRepository } from '../repository/LogRepository.js'

export class LogService {
	static async getAll(page, limit, search, startUTC, endUTC, movementType, selectedUsers) {
		const offset = limit ? (page - 1) * limit : null
		const result = await LogRepository.findAll(offset, limit, search, startUTC, endUTC, movementType, selectedUsers)

		return {
			totalRecords: result.count,
			totalPages: limit ? Math.ceil(result.count / limit) : 1,
			currentPage: limit ? parseInt(page, 10) : 1,
			recordsPerPage: limit ? parseInt(limit, 10) : result.count,
			logs: result.rows ? result.rows.map(data => LogDTO.toResponse(data)) : [],
		}
	}
}
