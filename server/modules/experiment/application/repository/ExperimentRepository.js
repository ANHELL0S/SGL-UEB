import { Sequelize } from 'sequelize'
import { experiments_Scheme } from '../../../../schema/schemes.js'
import { ExperimentEntity } from '../../domain/entities/ExperimentEntity.js'

export class ExperimentRepository {
	static async getAll(offset, limit, search) {
		const whereCondition = search
			? {
					[Sequelize.Op.or]: [{ name: { [Sequelize.Op.iLike]: `%${search}%` } }],
			  }
			: {}

		const dataFound = await experiments_Scheme.findAndCountAll({
			where: whereCondition,
			limit,
			offset,
			subQuery: false,
			distinct: true,
			order: [['createdAt', 'DESC']],
		})

		return {
			count: dataFound.count,
			rows: dataFound.rows.map(data => new ExperimentEntity(data)),
		}
	}

	static async getById(id) {
		const dataFound = await experiments_Scheme.findByPk(id)
		return new ExperimentEntity(dataFound)
	}

	static async create(data, transaction) {
		return await experiments_Scheme.create(data, { transaction })
	}

	static async update(id, data, transaction) {
		return await experiments_Scheme.update(data, { where: { id_experiment: id }, transaction })
	}

	static async delete(id, transaction) {
		return await experiments_Scheme.destroy({ where: { id_experiment: id }, transaction })
	}
}
