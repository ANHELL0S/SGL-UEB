import { Op, Sequelize } from 'sequelize'
import { unit_measurement_Schema } from '../../../../schema/schemes.js'

export class UnitMeasurementRepository {
	static async findLabByField(field, value) {
		return await unit_measurement_Schema.findOne({
			where: {
				[field]: value,
			},
		})
	}

	static async findLabByFieldExcept(field, value, id) {
		return await unit_measurement_Schema.findOne({
			where: {
				[field]: value,
				id_unit_measurement: {
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

		const dataFound = await unit_measurement_Schema.findAndCountAll({
			where: whereCondition,
			limit: limit || undefined,
			offset: offset || undefined,
			//subQuery: false, // FIXME:  only show 4 register, comment line === fix error
			distinct: true,
			order: [['updatedAt', 'DESC']],
		})

		return {
			count: dataFound.count,
			rows: dataFound.rows,
		}
	}

	static async findById(id) {
		return await unit_measurement_Schema.findByPk(id)
	}

	static async create(data, transaction) {
		return unit_measurement_Schema.create(data, { transaction })
	}

	static async update(id, data, transaction) {
		return unit_measurement_Schema.update(data, { where: { id_unit_measurement: id }, transaction })
	}

	static async delete(id, transaction) {
		return unit_measurement_Schema.destroy({ where: { id_unit_measurement: id }, transaction })
	}
}
