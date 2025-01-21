import { Sequelize } from 'sequelize'
import { AccessLabEntity } from '../../domain/entities/AccessLabEntity.js'
import {
	user_Schema,
	laboratory_Schema,
	access_lab_Scheme,
	experiments_Scheme,
	access_Scheme,
	access_faculty_Scheme,
	access_career_Scheme,
	access_director_Scheme,
	access_applicant_Scheme,
	career_Scheme,
	faculty_Scheme,
} from '../../../../schema/schemes.js'

export class AccessLabRepository {
	static async findAllAccessLabs(offset, limit, search) {
		const whereCondition = search
			? Sequelize.where(Sequelize.fn('concat', Sequelize.col('access.topic')), { [Sequelize.Op.iLike]: `%${search}%` })
			: {}

		const accessLabsFound = await access_Scheme.findAndCountAll({
			include: [
				{
					model: access_faculty_Scheme,
					include: [{ model: faculty_Scheme }],
				},
				{
					model: access_career_Scheme,
					include: [{ model: career_Scheme }],
				},
				{
					model: access_director_Scheme,
				},
				{ model: access_applicant_Scheme },
				{ model: access_lab_Scheme, include: [{ model: laboratory_Schema }] },
			],
			where: whereCondition,
			limit,
			offset,
			subQuery: false,
			distinct: true,
			order: [['createdAt', 'DESC']],
		})

		return {
			count: accessLabsFound.count,
			rows: accessLabsFound.rows,
		}
	}

	static async findAllAccessPertainLab(id, offset, limit, search) {
		const whereCondition = {
			...(search && {
				[Sequelize.Op.and]: [
					Sequelize.where(
						Sequelize.fn(
							'concat',
							Sequelize.col('access_labs.full_name'),
							Sequelize.col('access_labs.identification_card'),
							Sequelize.col('access_labs.description')
						),
						{ [Sequelize.Op.iLike]: `%${search}%` }
					),
				],
			}),
			// Filtro para filtrar por `id_lab` en todo el conjunto de datos
			'$access_labs.laboratory.id_lab$': id,
		}

		const accessLabsFound = await access_Scheme.findAndCountAll({
			include: [
				{
					model: access_faculty_Scheme,
					include: [{ model: faculty_Scheme }],
				},
				{
					model: access_career_Scheme,
					include: [{ model: career_Scheme }],
				},
				{
					model: access_director_Scheme,
				},
				{ model: access_applicant_Scheme },
				{
					model: access_lab_Scheme,
					include: [
						{
							model: laboratory_Schema,
						},
					],
				},
			],
			where: whereCondition,
			limit,
			offset,
			subQuery: false,
			distinct: true,
			order: [['createdAt', 'DESC']],
		})

		// Retornamos el conteo y los resultados, transformando los datos en entidades
		return {
			count: accessLabsFound.count,
			rows: accessLabsFound.rows,
		}
	}

	static async findAccessLabById(id) {
		const labFound = await access_lab_Scheme.findByPk(id, {
			include: [
				{
					model: laboratory_Schema,
				},
				{
					model: experiments_Scheme,
				},
				{
					model: user_Schema,
				},
			],
		})

		return new AccessLabEntity(labFound)
	}

	// CREATE
	static async createAccess(data, transaction) {
		return access_Scheme.create(data, { transaction })
	}

	static async createAccessFaculty(data, transaction) {
		return access_faculty_Scheme.create(data, { transaction })
	}

	static async createAccessCareer(data, transaction) {
		return access_career_Scheme.create(data, { transaction })
	}

	static async createAccessDirector(data, transaction) {
		return access_director_Scheme.create(data, { transaction })
	}

	static async createAccessApplicant(data, transaction) {
		return access_applicant_Scheme.create(data, { transaction })
	}

	static async createAccessLab(data, transaction) {
		return access_lab_Scheme.create(data, { transaction })
	}

	// UPDATE CREATE
	static async updateAccessLab(id, data, transaction) {
		return access_lab_Scheme.update(data, { where: { id_access_lab: id }, transaction })
	}

	static async deleteAccessLab(id, transaction) {
		return access_lab_Scheme.destroy({ where: { id_access_lab: id }, transaction })
	}
}
