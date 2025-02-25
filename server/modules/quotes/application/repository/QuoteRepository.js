import { Op, Sequelize } from 'sequelize'
import { QuotesEntity } from '../../domain/entities/QuotesEntity.js'
import {
	quotes_Scheme,
	quotes_experiments_Scheme,
	experiments_category_Scheme,
	experiments_parameter_Scheme,
	quotes_payments_Scheme,
	access_Scheme,
	user_Schema,
	user_role_main_Schema,
	user_roles_Schema,
	rol_Schema,
	access_faculty_Scheme,
	access_career_Scheme,
	access_director_Scheme,
	access_applicant_Scheme,
	access_lab_Scheme,
	quotes_labs_Scheme,
	laboratory_Schema,
	laboratory_analyst_Schema,
	quotes_pdf_Scheme,
} from '../../../../schema/schemes.js'
import { UserEntity } from '../../domain/entities/UserEntity.js'

export class QuoteRepository {
	static async findByField(field, value) {
		return await quotes_Scheme.findOne({
			where: {
				[field]: value,
			},
		})
	}

	static async findByFieldExcept(field, value, id) {
		return await quotes_Scheme.findOne({
			where: {
				[field]: value,
				id_quote: {
					[Op.ne]: id,
				},
			},
		})
	}

	static async findAll(offset, limit, search) {
		const whereCondition = search
			? {
					[Sequelize.Op.or]: [
						{ name: { [Sequelize.Op.iLike]: `%${search}%` } },
						{ dni: { [Sequelize.Op.iLike]: `%${search}%` } },
						{ code: { [Sequelize.Op.iLike]: `%${search}%` } },
					],
			  }
			: { type_quote: 'external' }

		const dataFound = await quotes_Scheme.findAndCountAll({
			paranoid: false,
			where: whereCondition,
			limit: limit || undefined,
			offset: offset || undefined,
			subQuery: false, // FIXME: error en labs only show 4 register, comment == fix error
			distinct: true,
			order: [['updatedAt', 'DESC']],
			include: [
				{
					model: quotes_experiments_Scheme,
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
				{
					model: quotes_payments_Scheme,
					paranoid: false,
				},
			],
		})

		return {
			count: dataFound.count,
			rows: dataFound.rows.map(data => new QuotesEntity(data)),
		}
	}

	static async findAllQuotesByUserId(id, offset, limit, search) {
		const whereCondition = search
			? {
					[Sequelize.Op.or]: [
						{ name: { [Sequelize.Op.iLike]: `%${search}%` } },
						{ dni: { [Sequelize.Op.iLike]: `%${search}%` } },
						{ code: { [Sequelize.Op.iLike]: `%${search}%` } },
					],
			  }
			: { type_quote: 'external' }

		const dataFound = await quotes_Scheme.findAndCountAll({
			paranoid: false,
			where: whereCondition,
			limit: limit || undefined,
			offset: offset || undefined,
			subQuery: false, // FIXME: error en labs only show 4 register, comment == fix error
			distinct: true,
			order: [['updatedAt', 'DESC']],
			include: [
				{
					model: quotes_experiments_Scheme,
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
				{
					model: quotes_payments_Scheme,
					paranoid: false,
				},
				{
					model: quotes_labs_Scheme,
					paranoid: false,
				},
			],
		})

		return {
			count: dataFound.count,
			rows: dataFound.rows.map(data => new QuotesEntity(data)),
		}
	}

	static async findToDirector() {
		const dataFound = await user_Schema.findAll({
			paranoid: false,
			include: [
				{
					model: user_role_main_Schema,
					include: [
						{
							model: user_roles_Schema,
							include: [
								{
									model: rol_Schema,
								},
							],
						},
					],
				},
			],
		})

		return {
			rows: dataFound.map(data => new UserEntity(data)),
		}
	}

	static async findById(id) {
		const dataFound = await quotes_Scheme.findByPk(id, {
			include: [
				{
					model: quotes_experiments_Scheme,
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
				{
					model: quotes_payments_Scheme,
				},
			],
			paranoid: false,
		})

		return dataFound ? new QuotesEntity(dataFound) : null
	}

	static async findQuoteByCode(code) {
		const dataFound = await quotes_Scheme.findOne({
			where: { code: code },
			include: [
				{
					model: quotes_experiments_Scheme,
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
				{ model: quotes_pdf_Scheme, paranoid: false },
				{
					model: quotes_payments_Scheme,
				},
				{
					model: quotes_labs_Scheme,
					include: [
						{
							model: laboratory_Schema,
							paranoid: false,
							include: [
								{
									model: laboratory_analyst_Schema,
									paranoid: false,
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
			paranoid: false,
		})

		return dataFound ? new QuotesEntity(dataFound) : null
	}

	static async createQuote(data, transaction) {
		const newData = await quotes_Scheme.create(data, { transaction })

		if (data.experiments && data.experiments.length > 0) {
			const experimentAssociations = await Promise.all(
				data.experiments.map(async exp => {
					const experiment = await experiments_parameter_Scheme.findByPk(exp.id_experiment)

					const pricePublic = parseFloat(experiment?.dataValues?.public_price) || 0
					const amount = parseFloat(exp.amount) || 0

					const totalCost = pricePublic * amount

					return {
						id_quote_fk: newData.id_quote,
						id_experiment_fk: exp.id_experiment,
						amount: exp.amount,
						total_cost: totalCost,
					}
				})
			)

			await quotes_experiments_Scheme.bulkCreate(experimentAssociations, { transaction })
		}

		const formattedQuote = new QuotesEntity(newData)

		return { quote: formattedQuote }
	}

	static async update(id, data, transaction) {
		const [updatedQuote] = await quotes_Scheme.update(data, {
			where: { id_quote: id },
			returning: true,
			transaction,
		})

		await quotes_experiments_Scheme.destroy({
			where: { id_quote_fk: id },
			transaction,
			paranoid: false,
			force: true,
		})

		if (data.experiments && data.experiments.length > 0) {
			const experimentAssociations = await Promise.all(
				data.experiments.map(async exp => {
					const experiment = await experiments_parameter_Scheme.findByPk(exp.id_experiment)

					const pricePublic = parseFloat(experiment?.dataValues?.public_price) || 0
					const amount = parseFloat(exp.amount) || 0

					const totalCost = pricePublic * amount

					return {
						id_quote_fk: id,
						id_experiment_fk: exp.id_experiment,
						amount: exp.amount,
						total_cost: totalCost,
					}
				})
			)

			await quotes_experiments_Scheme.bulkCreate(experimentAssociations, { transaction })
		}

		return { quote: updatedQuote }
	}

	static async changeStatus(id, data, transaction) {
		return await quotes_Scheme.update(data, {
			where: { id_quote: id },
			transaction,
		})
	}

	static async delete(id, transaction) {
		return quotes_Scheme.destroy({ where: { id_quote: id }, transaction })
	}

	static async restore(id, transaction) {
		return await quotes_Scheme.restore({
			where: { id_quote: id },
			transaction,
			paranoid: false,
		})
	}

	static async deletePermanent(id, transaction) {
		await quotes_experiments_Scheme.destroy({
			where: {
				id_quote_fk: id,
			},
			force: true,
			transaction,
			paranoid: false,
		})

		await quotes_payments_Scheme.destroy({
			where: {
				id_quote_fk: id,
			},
			transaction,
			force: true,
			paranoid: false,
		})

		await quotes_pdf_Scheme.destroy({
			where: {
				id_quote_fk: id,
			},
			force: true,
			transaction,
			paranoid: false,
		})

		const findAccess = await access_Scheme.findOne({
			where: {
				id_quote_fk: id,
			},
			transaction,
			force: true,
			paranoid: false,
		})

		if (findAccess) {
			await access_faculty_Scheme.destroy({
				where: {
					id_access_fk: findAccess.id_access,
				},
				transaction,
				force: true,
				paranoid: false,
			})

			await access_career_Scheme.destroy({
				where: {
					id_access_fk: findAccess.id_access,
				},
				transaction,
				force: true,
				paranoid: false,
			})

			await access_director_Scheme.destroy({
				where: {
					id_access_fk: findAccess.id_access,
				},
				transaction,
				force: true,
				paranoid: false,
			})

			await access_applicant_Scheme.destroy({
				where: {
					id_access_fk: findAccess.id_access,
				},
				transaction,
				force: true,
				paranoid: false,
			})

			await access_lab_Scheme.destroy({
				where: {
					id_access_fk: findAccess.id_access,
				},
				transaction,
				force: true,
				paranoid: false,
			})

			await access_Scheme.destroy({
				where: {
					id_quote_fk: id,
				},
				transaction,
				force: true,
				paranoid: false,
			})
		}

		return await quotes_Scheme.destroy({
			where: { id_quote: id },
			transaction,
			force: true,
			paranoid: false,
		})
	}
}
