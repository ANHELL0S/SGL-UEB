export class ConsumptionEntity {
	constructor(data) {
		this.id_consumption_reactive = data.id_consumption_reactive
		this.amount = data.amount
		this.access = data.access
		this.reactive = data.reactive
		this.user = data.user
		this.lab = data.laboratory
		this.kardex = data.kardex
		this.createdAt = data.createdAt
		this.updatedAt = data.updatedAt
		this.deletedAt = data.deletedAt
	}
}
