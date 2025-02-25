export class PaymentEntity {
	constructor(data) {
		this.id_quote_payment = data.id_quote_payment
		this.id_quote_fk = data.id_quote_fk
		this.bill = data.bill
		this.createdAt = data.createdAt
		this.updatedAt = data.updatedAt
	}

	hideSensitiveData() {
		return {
			id_quote_payment: this.id_quote_payment,
			id_quote_fk: this.id_quote_fk,
			bill: this.bill,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		}
	}
}
