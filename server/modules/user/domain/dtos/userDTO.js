export class UserDTO {
	static toResponse(entity) {
		return {
			id_user: entity.id,
			active: entity.active,
			names: entity.fullName,
			email: entity.email,
			phone: entity.phone,
			dni: entity.identificationCard,
			code: entity.code,
			roles: entity.roles,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
			deletedAt: entity.deletedAt,
		}
	}

	static fromRequest(data) {
		return {
			id_user: data.id,
			active: data.active,
			names: data.fullName,
			email: data.email,
			phone: data.phone,
			dni: data.identificationCard,
			code: data.code,
			roles: data.roles,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
			deletedAt: entity.deletedAt,
		}
	}

	static toResponseList(entities) {
		return entities.map(entity => this.toResponse(entity))
	}

	// FOR CREATE USER
	static transformData(data, isUpdate = false) {
		const transformedData = {
			active: data.active,
			full_name: data.names,
			email: data.email,
			phone: data.phone,
			identification_card: data.dni,
			password: data.password,
			code: data.code,
		}

		if (isUpdate) delete transformedData.password

		return transformedData
	}
}
