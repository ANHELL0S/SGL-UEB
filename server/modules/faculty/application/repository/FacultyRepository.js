import { career_Scheme, faculty_Scheme } from '../../../../schema/schemes.js'
import { FacultyEntity } from '../../domain/entities/facultyEntity.js'

export class FacultyRepository {
	static async getAll() {
		const dataFound = await faculty_Scheme.findAll({
			paranoid: false,
			include: [
				{
					model: career_Scheme,
					paranoid: false,
				},
			],
			subQuery: false,
			distinct: true,
			order: [['updatedAt', 'DESC']],
		})

		return {
			count: dataFound.count,
			rows: dataFound.map(data => new FacultyEntity(data)),
		}
	}

	static async getById(id) {
		const dataFound = await faculty_Scheme.findByPk(id, { paranoid: false })
		return new FacultyEntity(dataFound)
	}
}
