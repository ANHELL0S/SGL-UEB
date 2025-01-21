import { FacultyDTO } from '../../domain/dtos/facultyDTO.js'
import { FacultyRepository } from '../repository/FacultyRepository.js'

export class FacultyService {
	static async getAll() {
		const dataFound = await FacultyRepository.getAll()
		return {
			faculties: dataFound.rows.map(data => FacultyDTO.toResponse(data)),
		}
	}

	static async getById(id) {
		const dataFound = await FacultyRepository.getById(id)
		return FacultyDTO.toResponse(dataFound)
	}
}
