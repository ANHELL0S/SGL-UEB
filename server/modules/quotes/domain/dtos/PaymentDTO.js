export class PaymentDTO {
	static toResponse(data) {
		return {
			id_quote_payment: data.id_quote_payment,
			bill: data.bill,
			updatedAt: data.updatedAt,
			createdAt: data.createdAt,
		}
	}

	static toCreate(data) {
		return {
			id_quote_fk: data.id,
			bill: data.bill,
		}
	}

	static toUpdate(data) {
		return {
			bill: data.bill,
		}
	}
}
