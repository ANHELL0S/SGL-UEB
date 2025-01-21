export class ExperimentDTO {
	static toResponse(data) {
		return {
			id_experiment: data.id_experiment,
			name: data.name,
			public_price: data.public_price,
			internal_price: data.internal_price,
			status: data.status,
			createdAt: data.createdAt,
		}
	}
}
