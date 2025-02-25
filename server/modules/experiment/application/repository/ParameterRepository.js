import { Sequelize } from 'sequelize'
import {
	access_analysis_Scheme,
	experiments_category_Scheme,
	experiments_parameter_Scheme,
	quotes_experiments_Scheme,
} from '../../../../schema/schemes.js'
import { ExperimentEntity, ExperimenttoAccessEntity } from '../../domain/entities/ExperimentEntity.js'

export class ParameterRepository {
	static async getAll(offset, limit, search) {
		const whereCondition = search
			? {
					[Sequelize.Op.or]: [{ name: { [Sequelize.Op.iLike]: `%${search}%` } }],
			  }
			: {}

		const dataFound = await experiments_parameter_Scheme.findAndCountAll({
			include: [
				{
					model: experiments_category_Scheme,
					paranoid: false,
				},
			],
			paranoid: false,
			where: whereCondition,
			limit,
			offset,
			subQuery: false,
			distinct: true,
			order: [['updatedAt', 'DESC']],
		})

		return {
			count: dataFound.count,
			rows: dataFound.rows.map(data => new ExperimentEntity(data)),
		}
	}

	static async getAllToAcess(id) {
		const dataFound = await access_analysis_Scheme.findAndCountAll({
			where: {
				id_access_fk: id,
			},
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
			],
			paranoid: false,
			order: [['updatedAt', 'DESC']],
		})

		return {
			count: dataFound.count,
			rows: dataFound.rows.map(data => new ExperimenttoAccessEntity(data)),
		}
	}

	static async getById(id) {
		const dataFound = await experiments_parameter_Scheme.findByPk(id, { paranoid: false })
		return new ExperimentEntity(dataFound)
	}

	static async create(data, transaction) {
		return await experiments_parameter_Scheme.create(data, { transaction })
	}

	static async update(id, data, transaction) {
		return await experiments_parameter_Scheme.update(data, {
			where: { id_experiment_parameter: id },
			transaction,
			paranoid: false,
		})
	}

	static async delete(id, transaction) {
		return await experiments_parameter_Scheme.destroy({
			where: { id_experiment_parameter: id },
			transaction,
			paranoid: false,
		})
	}

	static async restore(id, transaction) {
		return await experiments_parameter_Scheme.restore({
			where: { id_experiment_parameter: id },
			transaction,
			paranoid: false,
		})
	}

	static async deletePermanent(id, transaction) {
		await quotes_experiments_Scheme.destroy({
			where: {
				id_experiment_fk: id,
			},
			transaction,
		})
		return await experiments_parameter_Scheme.destroy({
			where: { id_experiment_parameter: id },
			transaction,
			paranoid: false,
			force: true,
		})
	}
}
