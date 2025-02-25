export class SampleDTO {
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
			name: data.name,
			amount: parseFloat(data.amount),
			container: data.container,
			id_quote_fk: data.quote,
			id_unit_measurement_dk: data.unit_measurement,
			status: data.status,
			id_analyst_fk: data.user,
		}
	}

	static toUpdate(data) {
		return {
			name: data.name,
			amount: parseFloat(data.amount),
			container: data.container,
			id_quote_fk: data.quote,
			id_unit_measurement_dk: data.unit_measurement,
			status: data.status,
			id_analyst_fk: data.user,
		}
	}
}
