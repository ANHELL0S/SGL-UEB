import { KardexDTO } from '../../domain/dtos/kardexDTO.js'
import { ReactiveDTO } from '../../domain/dtos/reactiveDTO.js'
import { KardexRepository } from '../repository/kardexRepository.js'

export class KardexService {
	static async getAll(page, limit, search, startUTC, endUTC, movementType, control_tracking, selectedUsers) {
		const offset = limit ? (page - 1) * limit : null
		const result = await KardexRepository.findAll(
			offset,
			limit,
			search,
			startUTC,
			endUTC,
			movementType,
			control_tracking,
			selectedUsers
		)

		return {
			totalRecords: result.count,
			totalPages: limit ? Math.ceil(result.count / limit) : 1,
			currentPage: limit ? parseInt(page, 10) : 1,
			recordsPerPage: limit ? parseInt(limit, 10) : result.count,
			kardex: result.rows ? result.rows.map(data => KardexDTO.toResponse(data)) : [],
		}
	}

	static async getAllPertainToUser(
		id_user,
		page,
		limit,
		search,
		startUTC,
		endUTC,
		movementType,
		control_tracking,
		selectedUsers
	) {
		const offset = limit ? (page - 1) * limit : null
		const result = await KardexRepository.findAllPertainToUser(
			id_user,
			offset,
			limit,
			search,
			startUTC,
			endUTC,
			movementType,
			control_tracking,
			selectedUsers
		)

		return {
			totalRecords: result.count,
			totalPages: limit ? Math.ceil(result.count / limit) : 1,
			currentPage: limit ? parseInt(page, 10) : 1,
			recordsPerPage: limit ? parseInt(limit, 10) : result.count,
			kardex: result.rows ? result.rows.map(data => KardexDTO.toResponse(data)) : [],
		}
	}

	static async findReactiveById(id) {
		const dataFound = await KardexRepository.findReactiveById(id)
		return dataFound ? ReactiveDTO.toResponse(dataFound) : null
	}
}
