import { Op, Sequelize } from 'sequelize'
import { ConsumptionEntity } from '../../domain/entities/ConsumptionEntity.js'
import {
	sample_Schema,
	access_Scheme,
	user_Schema,
	quotes_Scheme,
	unit_measurement_Schema,
	consumptionReactive_Schema,
	reactive_Schema,
	laboratory_Schema,
	kardex_Schema,
	experiments_parameter_Scheme,
	experiments_category_Scheme,
} from '../../../../schema/schemes.js'

export class ConsumptionRepository {
	static async findByField(field, value) {
		return await sample_Schema.findOne({
			where: {
				[field]: value,
			},
		})
	}

	static async findByFieldExcept(field, value, id) {
		return await sample_Schema.findOne({
			where: {
				[field]: value,
				id_sample: {
					[Op.ne]: id,
				},
			},
		})
	}

	static async findAll(offset, limit, search) {
		const whereCondition = search
			? {
					[Sequelize.Op.or]: [{ name: { [Sequelize.Op.iLike]: `%${search}%` } }],
			  }
			: {}

		const dataFound = await consumptionReactive_Schema.findAndCountAll({
			paranoid: false,
			include: [
				{
					model: quotes_Scheme,
					paranoid: false,
				},
				{
					model: reactive_Schema,
					paranoid: false,
					include: [
						{
							model: unit_measurement_Schema,
							paranoid: false,
						},
					],
				},
				{
					model: user_Schema,
					paranoid: false,
				},
			],
			where: whereCondition,
			limit: limit || undefined,
			offset: offset || undefined,
			//subQuery: false, // FIXME: error en labs only show 4 register, comment == fix error
			distinct: true,
			order: [['updatedAt', 'DESC']],
		})

		return {
			count: dataFound.count,
			rows: dataFound.rows.map(data => new ConsumptionEntity(data)),
		}
	}

	static async findAlltoQuote(id, offset, limit, search) {
		const whereCondition = {
			...(search && {
				[Sequelize.Op.or]: [{ name: { [Sequelize.Op.iLike]: `%${search}%` } }],
			}),
			id_quote_fk: id,
		}

		const dataFound = await consumptionReactive_Schema.findAndCountAll({
			paranoid: false,
			include: [
				{
					model: quotes_Scheme,
					paranoid: false,
				},
				{
					model: reactive_Schema,
					paranoid: false,
					include: [
						{
							model: unit_measurement_Schema,
							paranoid: false,
						},
					],
				},
				{
					model: user_Schema,
					paranoid: false,
				},
				{
					model: laboratory_Schema,
					paranoid: false,
				},
			],
			where: whereCondition,
			limit: limit || undefined,
			offset: offset || undefined,
			//subQuery: false, // FIXME: error en labs only show 4 register, comment == fix error
			distinct: true,
			order: [['updatedAt', 'DESC']],
		})
		console.log(dataFound)

		return {
			count: dataFound.count,
			rows: dataFound.rows.map(data => new ConsumptionEntity(data)),
		}
	}

	static async findAllPertaintoUser(id, offset, limit, search) {
		const whereCondition = {
			...(search && {
				[Sequelize.Op.or]: [{ name: { [Sequelize.Op.iLike]: `%${search}%` } }],
			}),
			id_analyst_fk: id,
		}

		const dataFound = await consumptionReactive_Schema.findAndCountAll({
			paranoid: false,
			where: whereCondition,
			limit: limit || undefined,
			offset: offset || undefined,
			order: [['updatedAt', 'DESC']],
			include: [
				{
					model: quotes_Scheme,
					paranoid: false,
				},
				{
					model: reactive_Schema,
					paranoid: false,
					include: [
						{
							model: unit_measurement_Schema,
							paranoid: false,
						},
					],
				},
				{
					model: user_Schema,
					paranoid: false,
				},
				{
					model: laboratory_Schema,
					paranoid: false,
				},
				{
					model: kardex_Schema,
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
						{
							model: reactive_Schema,
							paranoid: false,
						},
					],
				},
			],
		})

		return {
			count: dataFound.count,
			rows: dataFound.rows.map(data => new ConsumptionEntity(data)),
		}
	}

	static async findById(id) {
		const dataFound = await sample_Schema.findByPk(id, {
			paranoid: false,
			include: [
				{
					model: access_Scheme,
					paranoid: false,
				},
				{
					model: unit_measurement_Schema,
					paranoid: false,
				},
				{
					model: user_Schema,
					paranoid: false,
				},
			],
		})

		return dataFound ? new ConsumptionEntity(dataFound) : null
	}

	static async create(data, transaction) {
		return await consumptionReactive_Schema.create(data, { transaction })
	}

	static async delete(id, transaction) {
		return consumptionReactive_Schema.destroy({
			where: { id_consumption_reactive: id },
			transaction,
			force: true,
			paranoid: false,
		})
	}
}
