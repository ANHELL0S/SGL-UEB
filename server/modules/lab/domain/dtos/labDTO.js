export class LabDTO {
	static toResponse(data) {
		return {
			id_lab: data.id_lab,
			active: data.active,
			name: data.name,
			location: data.location,
			description: data.description,
			analysts: data.analysts,
			access: data.access,
			totalAccess: data.totalAccess,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
			deletedAt: data.deletedAt,
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
		return entities.map(data => this.toResponse(data))
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
			id_lab_fk: data.lab,
			id_analyst_fk: data.user,
		}

		return transformedData
	}
}
