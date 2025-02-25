import { Op, Sequelize } from 'sequelize'
import { UnitMeasurementEntity } from '../../domain/entities/unitMeasurementEntity.js'
import { ReactiveEntity } from '../../domain/entities/reactiveEntity.js'
import { kardex_Schema, reactive_Schema, unit_measurement_Schema } from '../../../../schema/schemes.js'

export class ReactiveRepository {
	static async findByField(field, value) {
		return await reactive_Schema.findOne({
			paranoid: false,
			where: {
				[field]: value,
			},
		})
	}

	static async findByFieldExcept(field, value, id) {
		return await reactive_Schema.findOne({
			paranoid: false,
			where: {
				[field]: value,
				id_reactive: {
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
						{ code: { [Sequelize.Op.iLike]: `%${search}%` } },
					],
			  }
			: {}

		const dataFound = await reactive_Schema.findAndCountAll({
			paranoid: false,
			include: [
				{
					model: unit_measurement_Schema,
					paranoid: false,
				},
			],

			where: whereCondition,
			limit: limit || undefined,
			offset: offset || undefined,
			//subQuery: false, // FIXME: error en labs only show 4 register, comment == fix error
			//distinct: true,
			order: [['updatedAt', 'DESC']],
		})

		return {
			count: dataFound.count,
			rows: dataFound.rows.map(data => new ReactiveEntity(data)),
		}
	}

	static async findById(id) {
		const dataFound = await reactive_Schema.findByPk(id, {
			paranoid: false,
			include: [
				{
					model: unit_measurement_Schema,
					paranoid: false,
				},
			],
		})
		return new ReactiveEntity(dataFound)
	}

	static async findAllUnitMeasurement() {
		const dataFound = await unit_measurement_Schema.findAll({ paranoid: false })
		return {
			rows: dataFound.map(data => new UnitMeasurementEntity(data)),
		}
	}

	static async create(data, transaction) {
		return await reactive_Schema.bulkCreate(data, { transaction })
	}

	static async createOneReactive(data, transaction) {
		return await reactive_Schema.create(data, { transaction })
	}

	static async createMoreKardex(data, transaction) {
		return await kardex_Schema.bulkCreate(data, { transaction })
	}

	static async createKardex(data, transaction) {
		return await kardex_Schema.create(data, { transaction })
	}

	static async update(id, data, transaction) {
		return await reactive_Schema.update(data, { where: { id_reactive: id }, transaction, paranoid: false })
	}

	static async delete(id, transaction) {
		return await reactive_Schema.destroy({ where: { id_reactive: id }, transaction, paranoid: false })
	}

	static async restore(id, transaction) {
		return await reactive_Schema.restore({ where: { id_reactive: id }, transaction, paranoid: false })
	}

	static async deletePermanent(id, transaction) {
		await kardex_Schema.destroy({
			where: {
				id_reactive_fk: id,
			},
			transaction,
			force: true,
			paranoid: false,
		})
		return await reactive_Schema.destroy({ where: { id_reactive: id }, transaction, paranoid: false, force: true })
	}
}
