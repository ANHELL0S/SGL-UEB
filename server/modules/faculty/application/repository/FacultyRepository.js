import { career_Scheme, faculty_Scheme } from '../../../../schema/schemes.js'
import { FacultyEntity } from '../../domain/entities/facultyEntity.js'

export class FacultyRepository {
	static async getAll() {
		const dataFound = await faculty_Scheme.findAll({
			include: [
				{
					model: career_Scheme,
				},
			],
			subQuery: false,
			distinct: true,
			order: [['createdAt', 'DESC']],
		})

		return {
			count: dataFound.count,
			rows: dataFound.map(data => new FacultyEntity(data)),
		}
	}

	static async getById(id) {
		const dataFound = await faculty_Scheme.findByPk(id)
		return new FacultyEntity(dataFound)
	}
}
