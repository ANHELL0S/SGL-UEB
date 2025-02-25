import { Op, Sequelize } from 'sequelize'
import { AccessLabEntity } from '../../domain/entities/AccessLabEntity.js'
import {
	laboratory_Schema,
	access_lab_Scheme,
	access_Scheme,
	access_faculty_Scheme,
	access_career_Scheme,
	access_director_Scheme,
	access_applicant_Scheme,
	career_Scheme,
	faculty_Scheme,
	quotes_Scheme,
	quotes_experiments_Scheme,
	experiments_category_Scheme,
	experiments_parameter_Scheme,
	laboratory_analyst_Schema,
	user_Schema,
	sample_Schema,
	access_analysis_Scheme,
} from '../../../../schema/schemes.js'

export class AccessLabRepository {
	static async findAllAccessLabs(offset, limit, search) {
		const whereCondition = search
			? Sequelize.where(Sequelize.fn('concat', Sequelize.col('access.topic')), { [Sequelize.Op.iLike]: `%${search}%` })
			: {}

		const dataFound = await access_Scheme.findAndCountAll({
			include: [
				{
					model: quotes_Scheme,
					paranoid: false,
					include: [{ model: sample_Schema, paranoid: false }],
				},
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
				{ model: access_lab_Scheme, include: [{ model: laboratory_Schema, paranoid: false }] },
			],
			paranoid: false,
			where: whereCondition,
			limit,
			offset,
			subQuery: false,
			distinct: true,
			order: [['updatedAt', 'DESC']],
		})

		return {
			count: dataFound.count,
			rows: dataFound.rows && dataFound.rows.length > 0 ? dataFound.rows.map(data => new AccessLabEntity(data)) : null,
		}
	}

	static async findAllAccessPertainLab(id, offset, limit, search) {
		const whereConditions = {
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
			'$access_labs.laboratory.id_lab$': id,
		}

		const whereCondition = {
			'$access_labs.laboratory.id_lab$': id,
		}

		if (search) whereCondition[Sequelize.Op.or] = [{ topic: { [Sequelize.Op.iLike]: `%${search}%` } }]

		const dataFound = await access_Scheme.findAndCountAll({
			include: [
				{
					model: access_faculty_Scheme,
					include: [
						{
							model: faculty_Scheme,
							paranoid: false,
						},
					],
				},
				{
					model: access_career_Scheme,
					paranoid: false,
					include: [
						{
							model: career_Scheme,
							paranoid: false,
						},
					],
				},
				{
					model: access_director_Scheme,
				},
				{ model: access_applicant_Scheme },
				{
					model: access_lab_Scheme,
					paranoid: false,
					include: [
						{
							model: laboratory_Schema,
							paranoid: false,
						},
					],
				},
			],
			paranoid: false,
			where: whereConditions,
			limit,
			offset,
			subQuery: false,
			distinct: true,
			order: [['updatedAt', 'DESC']],
		})

		return {
			count: dataFound.count,
			rows: (dataFound.rows || []).map(data => new AccessLabEntity(data)),
		}
	}

	static async findQuoteToAccessById(id) {
		return await access_Scheme.findOne({
			where: { id_quote_fk: id },
			paranoid: false,
		})
	}

	static async findQuoteById(id) {
		return await quotes_Scheme.findOne({
			where: { id_quote: id },
			paranoid: false,
		})
	}

	static async getLaByAnalyst(id) {
		const dataFound = await laboratory_analyst_Schema.findAll({
			where: { id_analyst_fk: id },
			paranoid: false,
		})
		return dataFound.map(lab => lab.id_lab_fk)
	}

	static async findAccessLabById(id) {
		const dataFound = await access_Scheme.findByPk(id, {
			paranoid: false,
			include: [
				{
					model: quotes_Scheme,
					paranoid: false,
					include: [
						{
							model: quotes_experiments_Scheme,
							include: [
								{
									model: experiments_parameter_Scheme,
									paranoid: false,
									include: [{ model: experiments_category_Scheme, paranoid: false }],
								},
							],
						},
					],
				},
				{
					model: access_faculty_Scheme,
					include: [{ model: faculty_Scheme, paranoid: false }],
				},
				{
					model: access_career_Scheme,
					include: [{ model: career_Scheme, paranoid: false }],
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
							paranoid: false,
							include: [
								{
									model: laboratory_analyst_Schema,
									include: [
										{
											model: user_Schema,
											paranoid: false,
										},
									],
								},
							],
						},
					],
				},
			],
		})
		return dataFound ? new AccessLabEntity(dataFound) : null
	}

	static async findAccessLabByCode(id) {
		const dataFound = await access_Scheme.findOne({
			where: { code: id },
			paranoid: false,
			include: [
				{ model: quotes_Scheme, paranoid: false },
				{
					model: access_faculty_Scheme,
					include: [{ model: faculty_Scheme, paranoid: false }],
				},
				{
					model: access_career_Scheme,
					include: [{ model: career_Scheme, paranoid: false }],
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
							paranoid: false,
							include: [
								{
									model: laboratory_analyst_Schema,
									include: [
										{
											model: user_Schema,
											paranoid: false,
										},
									],
								},
							],
						},
					],
				},
				{
					model: access_analysis_Scheme,
					paranoid: false,
					include: [
						{
							model: experiments_parameter_Scheme,
							paranoid: false,
							include: [
								{
									model: experiments_category_Scheme,
									paranoid: false,
								},
							],
						},
					],
				},
			],
		})
		return dataFound ? new AccessLabEntity(dataFound) : null
	}

	static async findAccessByCode(code) {
		return await access_Scheme.findOne({
			where: { code: code },
			paranoid: false,
		})
	}

	static async isTimeAvailable(startTime, endTime) {
		return await access_Scheme.findOne({
			where: {
				[Op.or]: [
					{
						startTime: { [Op.between]: [startTime, endTime] },
					},
					{
						endTime: { [Op.between]: [startTime, endTime] },
					},
					{
						[Op.and]: [{ startTime: { [Op.lte]: startTime } }, { endTime: { [Op.gte]: endTime } }],
					},
				],
			},
		})
	}

	static async createQuote(data, transaction) {
		return await quotes_Scheme.create(data, { transaction })
	}

	static async createAccess(data, transaction) {
		return await access_Scheme.create(data, { transaction })
	}

	static async createAccessFaculty(data, transaction) {
		return await access_faculty_Scheme.create(data, { transaction })
	}

	static async createAccessCareer(data, transaction) {
		return await access_career_Scheme.create(data, { transaction })
	}

	static async createAccessDirector(data, transaction) {
		return await access_director_Scheme.create(data, { transaction })
	}

	static async createAccessApplicant(data, transaction) {
		return await access_applicant_Scheme.create(data, { transaction })
	}

	static async createAccessLabs(data, transaction) {
		return await access_lab_Scheme.create(data, { transaction })
	}

	static async updateAccess(id, data, transaction) {
		return await access_Scheme.update(data, { where: { id_access: id }, transaction, paranoid: false })
	}

	static async deleteAccess(id, transaction) {
		return await access_Scheme.destroy({ where: { id_access: id }, transaction })
	}

	static async restoreAccess(id, transaction) {
		return await access_Scheme.restore({ where: { id_access: id }, transaction })
	}

	static async deletePermanentAcess(id, transaction) {
		await access_faculty_Scheme.destroy({
			where: { id_access_fk: id },
			transaction,
			paranoid: false,
			force: true,
		})
		await access_faculty_Scheme.destroy({
			where: { id_access_fk: id },
			transaction,
			paranoid: false,
			force: true,
		})
		await access_career_Scheme.destroy({
			where: { id_access_fk: id },
			transaction,
			paranoid: false,
			force: true,
		})
		await access_director_Scheme.destroy({
			where: { id_access_fk: id },
			transaction,
			paranoid: false,
			force: true,
		})
		await access_applicant_Scheme.destroy({
			where: { id_access_fk: id },
			transaction,
			paranoid: false,
			force: true,
		})
		await access_lab_Scheme.destroy({
			where: { id_access_fk: id },
			transaction,
			paranoid: false,
			force: true,
		})
		return await access_Scheme.destroy({ where: { id_access: id }, transaction, paranoid: false, force: true })
	}
}
