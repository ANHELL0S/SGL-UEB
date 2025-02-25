export class AsignedLabDTO {
	static toResponse(data) {
		return {
			id_quote_lab: data.id_quote_lab,
			quote: data.quote,
			lab: data.lab,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
			deletedAt: data.deletedAt,
		}
	}

	static toCreate(data) {
		return {
			labs: data.labs.map(lab => ({
				id_lab_fk: lab.id,
			})),
			id_quote_fk: data.quote,
		}
	}
}
