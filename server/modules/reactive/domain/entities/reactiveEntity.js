export class ReactiveEntity {
	constructor(reactive) {
		this.id_reactive = reactive.id_reactive
		this.status = reactive.status
		this.name = reactive.name
		this.code = reactive.code
		this.number_of_containers = reactive.number_of_containers
		this.initial_quantity = reactive.initial_quantity
		this.current_quantity = reactive.current_quantity
		this.id_unit_measurement_fk = reactive.id_unit_measurement_fk
		this.unit = this.processUnitMeasurement(lab.units_measurement)
		this.cas = reactive.cas
		this.expiration_date = reactive.expiration_date
		this.quantity_consumed = reactive.quantity_consumed
		this.is_controlled = reactive.is_controlled
		this.updatedAt = reactive.updatedAt
		this.createdAt = reactive.createdAt
	}

	processUnitMeasurement(units) {
		return units?.units_measurement?.unit
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
			initial_quantity: this.initial_quantity,
			number_of_containers: this.number_of_containers,
			current_quantity: this.current_quantity,
			unit: this.unit,
			cas: this.cas,
			expiration_date: this.expiration_date,
			quantity_consumed: this.quantity_consumed,
			cas: this.cas,
			is_controlled: this.is_controlled,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		}
	}
}
