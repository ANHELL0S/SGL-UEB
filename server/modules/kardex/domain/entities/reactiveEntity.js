export class ReactiveEntity {
	constructor(data) {
		this.id_reactive = data.id_reactive
		this.status = data.status
		this.name = data.name
		this.code = data.code
		this.number_of_containers = data.number_of_containers
		this.current_quantity = data.current_quantity
		this.unit = this.processUnitMeasurement(data.units_measurement)
		this.cas = data.cas
		this.expiration_date = this.formatDate(data?.expiration_date)
		this.quantity_consumed = data.quantity_consumed
		this.updatedAt = data.updatedAt
		this.createdAt = data.createdAt
		this.deletedAt = data.deletedAt
	}

	// Método para formatear la fecha a MM/DD/YYYY
	formatDate(dateString) {
		if (!dateString) return null

		const date = new Date(dateString)
		if (isNaN(date)) return null // Verifica que sea una fecha válida

		const year = date.getFullYear()
		const month = String(date.getMonth() + 1).padStart(2, '0') // getMonth() devuelve 0-11
		const day = String(date.getDate()).padStart(2, '0')

		return `${year}-${month}-${day}`
	}

	processUnitMeasurement(units) {
		return units || null
	}

	isActive() {
		return this.status
	}

	hideSensitiveData() {
		return {
			id_reactive: this.id_reactive,
			status: this.status,
			name: this.name,
			code: this.code,
			number_of_containers: this.number_of_containers,
			current_quantity: this.current_quantity,
			unit: this.data.unit,
			cas: this.cas,
			expiration_date: this.expiration_date,
			quantity_consumed: this.quantity_consumed,
			cas: this.cas,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
			deletedAt: this.deletedAt,
		}
	}
}
