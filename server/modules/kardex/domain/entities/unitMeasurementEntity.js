export class UnitMeasurementEntity {
	constructor(data) {
		this.id_unit_measurement = data.id_unit_measurement
		this.unit = data.unit
	}

	hideSensitiveData() {
		return {
			id_unit_measurement: this.id_unit_measurement,
			unit: this.unit,
		}
	}
}
