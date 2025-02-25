import { Sequelize } from 'sequelize'
import { SampleEntity } from '../../domain/entities/SampleEntity.js'
import {
	sample_Schema,
	experiments_parameter_Scheme,
	access_Scheme,
	user_Schema,
	unit_measurement_Schema,
	sampleResult_Schema,
} from '../../../../schema/schemes.js'

export class ResultRepository {
	static async findAll(offset, limit, search) {
		const whereCondition = search
			? {
					[Sequelize.Op.or]: [{ code_assigned_ueb: { [Sequelize.Op.iLike]: `%${search}%` } }],
			  }
			: {}

		const dataFound = await sampleResult_Schema.findAndCountAll({
			paranoid: false,
			include: [
				{
					model: sample_Schema,
					paranoid: false,
					include: [
						{ model: access_Scheme, paranoid: false },
						{ model: { unit_measurement_Schema, paranoid: false } },
						{ model: { user_Schema, paranoid: false } },
					],
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

	static async findAlltoSample(id, offset, limit, search) {
		const whereCondition = {
			...(search && {
				[Sequelize.Op.or]: [{ code_assigned_ueb: { [Sequelize.Op.iLike]: `%${search}%` } }],
			}),
			id_sample_fk: id,
		}

		const dataFound = await sampleResult_Schema.findAndCountAll({
			paranoid: false,
			include: [
				{
					model: sample_Schema,
					paranoid: false,
					include: [
						{ model: access_Scheme, paranoid: false },
						{ model: { unit_measurement_Schema, paranoid: false } },
						{ model: { user_Schema, paranoid: false } },
					],
				},
			],
			where: whereCondition,
			limit: limit || undefined,
			offset: offset || undefined,
			distinct: true,
			order: [['updatedAt', 'DESC']],
		})

		return {
			count: dataFound.count,
			rows: dataFound.rows.map(data => new SampleEntity(data)),
		}
	}

	static async create(data, transaction) {
		return await sampleResult_Schema.create(data, { transaction })
	}

	static async update(id, data, transaction) {
		return await sampleResult_Schema.update(data, { where: { id_sample_result: id }, transaction, paranoid: false })
	}

	static async delete(id, transaction) {
		return sampleResult_Schema.destroy({ where: { id_sample_result: id }, transaction, force: true, paranoid: false })
	}
}
