import { Op, Sequelize } from 'sequelize'
import { LabEntity } from '../../domain/entities/labEntity.js'
import {
	user_Schema,
	laboratory_Schema,
	laboratory_analyst_Schema,
	access_lab_Scheme,
	access_Scheme,
} from '../../../../schema/schemes.js'

export class LabRepository {
	static async findLabByField(field, value) {
		return await laboratory_Schema.findOne({
			where: {
				[field]: value,
			},
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
		})
	}

	/*
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
							attributes: ['full_name'],
						},
					],
				},
				{
					model: access_Scheme,
				},
			],

			where: whereCondition,
			limit,
			offset,
			subQuery: false,
			distinct: true,
			order: [['createdAt', 'DESC']],
		})

		return {
			count: labsFound.count,
			rows: labsFound.rows.map(lab => new LabEntity(lab)),
		}
	}
	*/

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
							attributes: ['full_name'],
						},
					],
				},
				{
					model: access_lab_Scheme,
				},
			],

			where: whereCondition,
			limit: limit || undefined,
			offset: offset || undefined,
			//subQuery: false, // FIXME: error en labs only show 4 register, comment == fix error
			distinct: true,
			order: [['createdAt', 'DESC']],
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
							attributes: ['full_name'],
						},
					],
				},
				{
					model: access_lab_Scheme,
				},
			],
		})

		return labFound ? new LabEntity(labFound) : null
	}

	static async createLab(data, transaction) {
		return laboratory_Schema.create(data, { transaction })
	}

	static async updateLab(id, data, transaction) {
		return laboratory_Schema.update(data, { where: { id_lab: id }, transaction })
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
