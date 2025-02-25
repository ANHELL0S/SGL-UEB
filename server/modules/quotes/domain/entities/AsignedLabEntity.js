export class AsignedLabEntity {
	constructor(data) {
		this.id_quote_lab = data.id_quote_lab
		this.quote = data.quote
		this.lab = data.laboratory
		this.createdAt = data.createdAt
		this.updatedAt = data.updatedAt
		this.deletedAt = data.deletedAt
	}
}
