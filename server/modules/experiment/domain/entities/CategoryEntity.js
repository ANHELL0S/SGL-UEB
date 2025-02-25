export class ExperimentEntity {
	constructor(data) {
		this.id_experiment_category = data?.id_experiment_category
		this.name = data?.name
		this.total_parameter = this.processParametersCount(data?.experiments_parameters)
		this.createdAt = data?.createdAt
		this.updatedAt = data?.updatedAt
		this.deletedAt = data?.deletedAt
	}

	processParametersCount(parameters) {
		return parameters?.length ?? 0
	}
}
