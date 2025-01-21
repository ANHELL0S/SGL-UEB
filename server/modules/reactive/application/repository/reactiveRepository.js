import { Op, Sequelize } from 'sequelize'
import { ReactiveEntity } from '../../domain/entities/reactiveEntity.js'
import { UnitMeasurementEntity } from '../../domain/entities/unitMeasurementEntity.js'
import {
	user_Schema,
	laboratory_Schema,
	laboratory_analyst_Schema,
	access_lab_Scheme,
	reactive_Schema,
	unit_measurement_Schema,
} from '../../../../schema/schemes.js'

export class ReactiveRepository {
	static async findByField(field, value) {
		return await reactive_Schema.findOne({
			where: {
				[field]: value,
			},
		})
	}

	static async findByFieldExcept(field, value, id) {
		return await reactive_Schema.findOne({
			where: {
				[field]: value,
				id_lab: {
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
			include: [
				{
					model: unit_measurement_Schema,
				},
			],

			where: whereCondition,
			limit: limit || undefined,
			offset: offset || undefined,
			//subQuery: false, // FIXME: error en labs only show 4 register, comment == fix error
			//distinct: true,
			order: [['createdAt', 'DESC']],
		})

		return {
			count: dataFound.count,
			rows: dataFound.rows,
		}
	}

	static async findById(id) {
		return await reactive_Schema.findByPk(id, {
			include: [
				{
					model: unit_measurement_Schema,
				},
			],
		})
	}

	static async findToName(name) {
		const labFound = await laboratory_Schema.findOne({
			where: { name: name },
			include: [
				{
					model: laboratory_analyst_Schema,
					include: [
						{
							model: user_Schema,
							attributes: ['full_name'],
						},
					],
				},
				{
					model: access_lab_Scheme,
				},
			],
		})

		return labFound ? new ReactiveEntity(labFound) : null
	}

	static async findAllUnitMeasurement() {
		const dataFound = await unit_measurement_Schema.findAll()
		return {
			rows: dataFound.map(data => new UnitMeasurementEntity(data)),
		}
	}

	static async create(data, transaction) {
		return await reactive_Schema.bulkCreate(data, { transaction })
	}

	static async update(id, data, transaction) {
		return await reactive_Schema.update(data, { where: { id_reactive: id }, transaction })
	}

	static async assignAnalystLab(data) {
		return laboratory_analyst_Schema.create(data)
	}

	static async findLaboratoryAnalyst(id) {
		return laboratory_analyst_Schema.findOne({ where: { id_lab_fk: id } })
	}

	static async findAccessLab(id) {
		return access_lab_Scheme.findOne({ where: { id_lab_fk: id } })
	}

	static async removeAssignAnalystLab(id, transaction) {
		return laboratory_analyst_Schema.destroy({ where: { id_lab_fk: id }, transaction })
	}

	static async deleteLab(id, transaction) {
		return laboratory_Schema.destroy({ where: { id_lab: id }, transaction })
	}
}
