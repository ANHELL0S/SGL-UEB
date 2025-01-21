export class ExperimentEntity {
	constructor(data) {
		this.id_experiment = data.id_experiment
		this.name = data.name
		this.public_price = data.public_price
		this.internal_price = data.internal_price
		this.status = data.status
		this.createdAt = data.createdAt
	}

	static formaterToCreate(data) {
		return {
			name: data.name,
			public_price: data.public_price,
			internal_price: data.internal_price,
		}
	}

	static formaterToUpdate(data) {
		return {
			name: data.name,
			public_price: data.public_price,
			internal_price: data.internal_price,
		}
	}
}
