export class ReportDTO {
	static toResponse(data) {
		return {
			id_report: data.id_report,
			number: data.number,
			senior_analyst: data.senior_analyst,
			collaborating_analyst: data.collaborating_analyst,
			code: data.code,
			isIssued: data.isIssued,
			sample: data.sample,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
			deletedAt: data.deletedAt,
		}
	}

	static toCreate(data) {
		return {
			senior_analyst: data.user,
			collaborating_analyst: data.collaborator ?? null,
			id_sample_fk: data.sample,
		}
	}

	static toUpdate(data) {
		return {
			senior_analyst: data.user,
			collaborating_analyst: data.collaborator ?? null,
			id_sample_fk: data.sample,
		}
	}
}
