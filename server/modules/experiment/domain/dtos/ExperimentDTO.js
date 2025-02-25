export class ExperimentDTO {
	static toResponse(data) {
		return {
			id_experiment_parameter: data.id_experiment_parameter,
			status: data.status,
			name: data.name,
			amount: data.amount,
			public_price: data.public_price,
			category: data.category,
			createdAt: data?.createdAt,
			updatedAt: data.updatedAt,
			deletedAt: data.deletedAt,
		}
	}

	static toCreate(data) {
		return {
			name: data?.name,
			public_price: parseFloat(data?.public_price),
			id_experiment_category_fk: data?.category,
		}
	}

	static toUpdate(data) {
		return {
			name: data?.name,
			public_price: parseFloat(data?.public_price),
			id_experiment_category_fk: data?.category,
		}
	}

	static toChangeStatus(data) {
		return {
			status: Boolean(data?.status),
		}
	}
}
