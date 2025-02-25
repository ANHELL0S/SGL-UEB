export class AnalysisDTO {
	static toResponse(data) {
		return {
			id_access_analysis: data.id_access_analysis,
			analysis: data.analysis,
			amount: data.amount,
			total_cost: data.total_cost,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
			deletedAt: data.deletedAt,
		}
	}

	static toCreate(data) {
		return {
			id_access_fk: data.access,
			experiments: data.experiments.map(analysis => ({
				id_experiment_fk: analysis.id,
				amount: analysis.amount,
			})),
		}
	}
}
