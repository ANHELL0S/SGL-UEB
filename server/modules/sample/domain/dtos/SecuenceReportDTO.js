export class SecuenceReportDTO {
	static toResponse(data) {
		return {
			id_sample: data.id_sample,
			name: data.name,
			amount: data.amount,
			container: data.container,
			status: data.status,
			quote: data.quote,
			unit_measurement: data.unit_measurement,
			user: data.user,
			results: data.results,
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
			id_quote_fk: data.quote,
		}
	}

	static toUpdate(data) {
		return {
			senior_analyst: data.senior_analyst,
			collaborating_analyst: data.collaborating_analyst ?? null,
			id_quote_fk: data.quote,
			id_sample_fk: data.sample,
		}
	}
}
