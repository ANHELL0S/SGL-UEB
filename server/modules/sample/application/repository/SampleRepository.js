import { Op, Sequelize } from 'sequelize'
import { SampleEntity } from '../../domain/entities/SampleEntity.js'
import {
	sample_Schema,
	quotes_payments_Scheme,
	quotes_experiments_Scheme,
	experiments_category_Scheme,
	experiments_parameter_Scheme,
	access_Scheme,
	user_Schema,
	quotes_Scheme,
	unit_measurement_Schema,
	sampleResult_Schema,
	access_applicant_Scheme,
	sample_report_Schema,
} from '../../../../schema/schemes.js'

export class SampleRepository {
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

		const dataFound = await sample_Schema.findAndCountAll({
			paranoid: false,
			include: [
				{
					model: quotes_Scheme,
					paranoid: false,
					include: [{ model: access_Scheme, paranoid: false }],
				},
				{
					model: unit_measurement_Schema,
					paranoid: false,
				},
				{
					model: sampleResult_Schema,
					paranoid: false,
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
			rows: dataFound.rows.map(data => new SampleEntity(data)),
		}
	}

	static async findAlltoQuote(id) {
		const dataFound = await sample_Schema.findAndCountAll({
			distinct: true,
			paranoid: false,
			where: { id_quote_fk: id },
			order: [['updatedAt', 'DESC']],
			include: [
				{
					model: quotes_Scheme,
					paranoid: false,
				},
				{
					model: unit_measurement_Schema,
					paranoid: false,
				},
				{
					model: sampleResult_Schema,
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
							model: user_Schema,
							paranoid: false,
						},
					],
				},
				{
					model: user_Schema,
					paranoid: false,
				},
			],
		})

		return {
			count: dataFound.count,
			rows: dataFound.rows.map(data => new SampleEntity(data)),
		}
	}

	static async findById(id) {
		const dataFound = await sample_Schema.findByPk(id, {
			paranoid: false,
			include: [
				{
					model: quotes_Scheme,
					paranoid: false,
					include: [
						{
							model: access_Scheme,
							paranoid: false,
							include: [
								{
									model: access_applicant_Scheme,
									paranoid: false,
								},
							],
						},
					],
				},
				{
					model: unit_measurement_Schema,
					paranoid: false,
				},
				{
					model: sampleResult_Schema,
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
							model: user_Schema,
							paranoid: false,
						},
					],
				},
				{
					model: user_Schema,
					paranoid: false,
				},
			],
		})

		return dataFound ? new SampleEntity(dataFound) : null
	}

	static async create(data, transaction) {
		return await sample_Schema.create(data, { transaction })
	}

	static async update(id, data, transaction) {
		return await sample_Schema.update(data, { where: { id_sample: id }, transaction, paranoid: false })
	}

	static async delete(id, transaction) {
		const findResult = await sampleResult_Schema.desfindByPktroy({
			where: { id_sample_fk: id },
			force: true,
			paranoid: false,
		})

		return sample_Schema.destroy({ where: { id_sample: id }, transaction, force: true, paranoid: false })
	}

	// REPORT

	static async findLastReport() {
		return await sample_report_Schema.findOne({
			order: [['number', 'DESC']],
		})
	}

	static async findReportById(id, transaction) {
		return await sample_report_Schema.findByPk(id, {
			transaction,
			paranoid: false,
		})
	}

	static async createReport(data, transaction) {
		return await sample_report_Schema.create(data, { transaction })
	}

	static async updateReport(id, data, transaction) {
		return await sample_report_Schema.update(data, {
			where: { id_report: id },
			transaction,
			force: true,
			paranoid: false,
		})
	}
}
