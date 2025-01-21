export class UnitMeasurementEntity {
	constructor(lab) {
		this.id_unit_measurement = lab.id_unit_measurement
		this.name = lab.name
		this.unit = lab.unit
		this.location = lab.location
		this.updatedAt = lab.updatedAt
		this.createdAt = lab.createdAt
	}

	hideSensitiveData() {
		return {
			id_unit_measurement: this.id_unit_measurement,
			name: this.name,
			unit: this.unit,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		}
	}
}
