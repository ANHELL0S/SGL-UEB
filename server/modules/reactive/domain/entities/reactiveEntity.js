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
		this.control_tracking = data.control_tracking
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
}
