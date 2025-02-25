export class ConsumptionDTO {
	static toResponse(data) {
		return {
			id_consumption_reactive: data.id_consumption_reactive,
			amount: parseFloat(data.amount).toFixed(5),
			quote: data.quotes,
			reactive: data.reactive,
			lab: data.lab,
			user: data.user,
			lab: data.lab,
			kardex: data.kardex,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
			deletedAt: data.deletedAt,
		}
	}

	static toCreate(data) {
		return {
			id_quote_fk: data?.quote ?? null,
			id_lab_fk: data?.lab ?? null,
			id_reactive_fk: data?.reactive,
			id_analysis_fk: data?.analysis,
			amount: parseFloat(data.amount),
			id_analyst_fk: data?.user,
			notes: data?.notes,
		}
	}
}
