export class KardexEntity {
	constructor(data) {
		this.id_kardex = data?.id_kardex
		this.user = data?.user
		this.reactive = data?.reactive
		this.analysis = data?.experiments_parameter
		this.action_type = data?.action_type
		this.quantity = parseFloat(data?.quantity).toFixed(5)
		this.balance_after_action = parseFloat(data?.balance_after_action).toFixed(5)
		this.notes = data?.notes
		this.consumption = data?.consumption_reactive
		this.updatedAt = data?.updatedAt
		this.createdAt = data?.createdAt
		this.deletedAt = data?.deletedAt
	}
}
