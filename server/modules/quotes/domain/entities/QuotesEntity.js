export class QuotesEntity {
	constructor(data) {
		this.id_quote = data.id_quote
		this.type_quote = data.type_quote
		this.type_sample = data.type_sample
		this.amount_sample = data.amount_sample
		this.detail_sample = data.detail_sample
		this.name = data.name
		this.email = data.email
		this.direction = data.direction
		this.dni = data.dni
		this.phone = data.phone
		this.status = data.status
		this.code = data.code
		this.bill = data.quotes_payment?.bill || ''
		this.pdf = data.quotes_pdf
		this.experiments = this.processExperiment(data.quotes_experiments)
		this.labs = data.quotes_labs
		this.createdAt = data.createdAt
		this.updatedAt = data.updatedAt
		this.deletedAt = data.deletedAt
	}

	processExperiment(experiments) {
		const processed = experiments?.map(experiment => {
			const expData = experiment?.experiments_parameter?.dataValues || {}
			const categoryData = expData?.experiments_category?.dataValues || {}

			return {
				experiment: {
					id_experiment_parameter: expData.id_experiment_paramete,
					id_experiment_category: expData.id_experiment_category,
					name: expData.name,
					public_price: expData.public_price,
					status: expData.status,
					createdAt: expData.createdAt,
					updatedAt: expData.updatedAt,
					deletedAt: expData.deletedAt,
					category: categoryData
						? {
								id_category: categoryData.i,
								name: categoryData.n,
								createdAt: categoryData.c,
								updatedAt: categoryData.u,
								deletedAt: categoryData.d,
						  }
						: null,
					amount: experiment.amount,
					total_cost: experiment.total_cost,
				},
			}
		})

		return processed
	}
}
