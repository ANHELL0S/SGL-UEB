export class LabDTO {
	static toResponse(entity) {
		return {
			id_lab: entity.id_lab,
			active: entity.active,
			name: entity.name,
			location: entity.location,
			description: entity.description,
			analysts: entity.analysts,
			//access: entity.access,
			totalAccess: entity.totalAccess,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		}
	}

	static fromRequest(data) {
		return {
			id_lab: data.id_lab,
			active: data.active,
			name: data.name,
			location: data.location,
			description: data.description,
			analysts: data.analysts,
			totalAccess: data.totalAccess,
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
			location: data.location,
			description: data.description,
			active: data.active,
		}

		return transformedData
	}

	static assignAnalystLab(data) {
		const transformedData = {
			id_lab_fk: data.id_lab,
			id_analyst_fk: data.id_user,
		}

		return transformedData
	}
}
