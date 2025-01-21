export class UnitMeasurementDTO {
	static toResponse(entity) {
		return {
			id_unit_measurement: entity.id_unit_measurement,
			name: entity.name,
			unit: entity.unit,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		}
	}

	static fromRequest(data) {
		return {
			id_unit_measurement: data.id_unit_measurement,
			name: data.name,
			unit: data.unit,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
		}
	}

	static toResponseList(entities) {
		return entities.map(entity => this.toResponse(entity))
	}

	static transformData(data) {
		const transformedData = {
			name: data.name,
			unit: data.unit,
		}
		return transformedData
	}
}
