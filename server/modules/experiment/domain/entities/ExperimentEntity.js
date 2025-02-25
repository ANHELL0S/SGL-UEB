export class ExperimentEntity {
	constructor(data) {
		this.id_experiment_parameter = data?.id_experiment_parameter
		this.category = data?.experiments_category
		this.name = data.name
		this.amount = data?.amount
		this.public_price = data?.public_price
		this.status = data?.status
		this.createdAt = data.createdAt
		this.updatedAt = data.updatedAt
		this.deletedAt = data.deletedAt
	}
}

export class ExperimenttoAccessEntity {
	constructor(data) {
		this.id_experiment_parameter = data?.experiments_parameter?.dataValues?.id_experiment_parameter
		this.name = data?.experiments_parameter?.name
		this.public_price = data?.experiments_parameter?.public_price
		this.amount = data?.amount
		this.status = data?.experiments_parameter?.status
		this.category = data?.experiments_parameter?.experiments_category
		this.createdAt = data?.experiments_parameter?.createdAt
		this.updatedAt = data?.experiments_parameter?.updatedAt
		this.deletedAt = data?.experiments_parameter?.deletedAt
	}
}
