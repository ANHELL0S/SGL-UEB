import { Op, Sequelize } from 'sequelize'
import { LabEntity } from '../../domain/entities/labEntity.js'
import {
	user_Schema,
	laboratory_Schema,
	laboratory_analyst_Schema,
	access_lab_Scheme,
	quotes_labs_Scheme,
} from '../../../../schema/schemes.js'

export class LabRepository {
	static async findLabByField(field, value) {
		return await laboratory_Schema.findOne({
			where: {
				[field]: value,
			},
			paranoid: false,
		})
	}

	static async findLabByFieldExcept(field, value, id) {
		return await laboratory_Schema.findOne({
			where: {
				[field]: value,
				id_lab: {
					[Op.ne]: id,
				},
			},
			paranoid: false,
		})
	}

	static async findAllLabs(offset, limit, search) {
		const whereCondition = search
			? {
					[Sequelize.Op.or]: [
						{ name: { [Sequelize.Op.iLike]: `%${search}%` } },
						{ location: { [Sequelize.Op.iLike]: `%${search}%` } },
						{ description: { [Sequelize.Op.iLike]: `%${search}%` } },
					],
			  }
			: {}

		const labsFound = await laboratory_Schema.findAndCountAll({
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
				{
					model: access_lab_Scheme,
				},
			],
			paranoid: false,
			where: whereCondition,
			limit: limit || undefined,
			offset: offset || undefined,
			order: [['updatedAt', 'DESC']],
		})

		return {
			count: labsFound.count,
			rows: labsFound.rows.map(lab => new LabEntity(lab)),
		}
	}

	static async findLabById(id) {
		const labFound = await laboratory_Schema.findByPk(id, {
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
			paranoid: false,
		})

		return labFound ? new LabEntity(labFound) : null
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
							paranoid: false,
						},
					],
				},
				{
					model: access_lab_Scheme,
				},
			],
			paranoid: false,
		})

		return labFound ? new LabEntity(labFound) : null
	}

	static async createLab(data, transaction) {
		return await laboratory_Schema.create(data, { transaction })
	}

	static async updateLab(id, data, transaction) {
		return await laboratory_Schema.update(data, { where: { id_lab: id }, transaction, paranoid: false })
	}

	static async assignAnalystLab(data) {
		return await laboratory_analyst_Schema.create(data)
	}

	static async findLaboratoryAnalyst(id) {
		return await laboratory_analyst_Schema.findOne({ where: { id_lab_fk: id } })
	}

	static async findAccessLab(id) {
		return await access_lab_Scheme.findOne({ where: { id_lab_fk: id } })
	}

	static async removeAssignAnalystLab(id, transaction) {
		return await laboratory_analyst_Schema.destroy({ where: { id_lab_fk: id }, transaction })
	}

	static async deleteLab(id, transaction) {
		return await laboratory_Schema.destroy({ where: { id_lab: id }, transaction })
	}

	static async restoreLab(id, transaction) {
		return await laboratory_Schema.restore({ where: { id_lab: id }, transaction })
	}

	static async deletePermanentLab(id, transaction) {
		return await laboratory_Schema.destroy({ where: { id_lab: id }, transaction, paranoid: false, force: true })
	}
}
