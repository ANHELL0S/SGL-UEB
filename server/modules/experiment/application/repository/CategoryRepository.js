import { Sequelize } from 'sequelize'
import { ExperimentEntity } from '../../domain/entities/CategoryEntity.js'
import { experiments_category_Scheme, experiments_parameter_Scheme } from '../../../../schema/schemes.js'

export class CategoryRepository {
	static async getAll(offset, limit, search) {
		const whereCondition = search
			? {
					[Sequelize.Op.or]: [{ name: { [Sequelize.Op.iLike]: `%${search}%` } }],
			  }
			: {}

		const dataFound = await experiments_category_Scheme.findAndCountAll({
			include: [
				{
					model: experiments_parameter_Scheme,
					paranoid: false,
				},
			],
			paranoid: false,
			where: whereCondition,
			limit,
			offset,
			distinct: true,
			order: [['updatedAt', 'DESC']],
		})

		return {
			count: dataFound.count,
			rows: dataFound.rows.map(data => new ExperimentEntity(data)),
		}
	}

	static async getById(id) {
		const dataFound = await experiments_category_Scheme.findByPk(id, { paranoid: false })
		return new ExperimentEntity(dataFound)
	}

	static async create(data, transaction) {
		return await experiments_category_Scheme.create(data, { transaction })
	}

	static async update(id, data, transaction) {
		return await experiments_category_Scheme.update(data, {
			where: { id_experiment_category: id },
			transaction,
		})
	}

	static async delete(id, transaction) {
		return await experiments_category_Scheme.destroy({ where: { id_experiment_category: id }, transaction })
	}

	static async restore(id, transaction) {
		return await experiments_category_Scheme.restore({ where: { id_experiment_category: id }, transaction })
	}

	static async deletePermanent(id, transaction) {
		return await experiments_category_Scheme.destroy({
			where: { id_experiment_category: id },
			transaction,
			paranoid: false,
			force: true,
		})
	}
}
