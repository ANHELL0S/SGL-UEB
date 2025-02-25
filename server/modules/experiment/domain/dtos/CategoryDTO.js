export class CategoryDTO {
	static toResponse(data) {
		return {
			id_experiment_category: data?.id_experiment_category,
			name: data?.name,
			total_parameter: data?.total_parameter,
			createdAt: data?.createdAt,
			updatedAt: data?.updatedAt,
			deletedAt: data?.deletedAt,
		}
	}

	static toCreate(data) {
		return {
			name: data?.name,
		}
	}

	static toUpdate(data) {
		return {
			name: data?.name,
		}
	}
}
