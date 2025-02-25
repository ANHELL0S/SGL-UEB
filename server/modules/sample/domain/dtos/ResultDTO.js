export class ResultDTO {
	static toResponse(data) {
		return {
			id_sample_result: data.id_sample_result,
			sample: data.sample,
			code_assigned_ueb: data.code_assigned_ueb,
			result: data.result,
			analysis: data.analysis,
			date_result: data.date_result,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
			deletedAt: data.deletedAt,
		}
	}

	static toCreate(data) {
		return {
			id_sample_fk: data.sample,
			id_analysis_fk: data.analysis,
			result: data.result,
			id_analyst_fk: data.user,
		}
	}

	static toUpdate(data) {
		return {
			id_sample_fk: data.sample,
			id_analysis_fk: data.analysis,
			result: data.result,
			id_analyst_fk: data.user,
		}
	}
}
