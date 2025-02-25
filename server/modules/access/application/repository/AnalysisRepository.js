import { AnalysisEntity } from '../../domain/entities/AnalysisEntity.js'
import {
	access_analysis_Scheme,
	experiments_category_Scheme,
	experiments_parameter_Scheme,
} from '../../../../schema/schemes.js'

export class AnalysisRepository {
	static async findAll(id) {
		const dataFound = await access_analysis_Scheme.findAndCountAll({
			where: { id_access_fk: id },
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
			order: [['createdAt', 'DESC']],
		})

		return {
			count: dataFound.count,
			rows: (dataFound || []).rows.map(data => new AnalysisEntity(data)),
		}
	}

	static async findById(id) {
		const dataFound = await access_analysis_Scheme.findByPk(id, {
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
		})
		return dataFound ? new AnalysisEntity(dataFound) : null
	}

	static async create(data, transaction) {
		// Si no existen experimentos, salimos de la función
		if (!data.experiments || data.experiments.length === 0) return

		const experimentAssociations = await Promise.all(
			data.experiments.map(async exp => {
				// Buscamos el experimento utilizando la propiedad id_experiment_fk
				const experiment = await experiments_parameter_Scheme.findByPk(exp.id_experiment_fk)

				if (!experiment) {
					throw new Error(`No se encontró el experimento con id: ${exp.id_experiment_fk}`)
				}

				const pricePublic = parseFloat(experiment.public_price) || 0
				const amount = parseFloat(exp.amount) || 0
				const totalCost = pricePublic * amount

				return {
					id_access_fk: data.id_access_fk,
					id_experiment_fk: exp.id_experiment_fk,
					amount: amount,
					total_cost: totalCost,
				}
			})
		)

		await access_analysis_Scheme.bulkCreate(experimentAssociations, { transaction })
	}

	static async deletePermanent(id, transaction) {
		return await access_analysis_Scheme.destroy({
			where: {
				id_access_fk: id,
			},
			force: true,
			transaction,
			paranoid: false,
		})
	}
}
