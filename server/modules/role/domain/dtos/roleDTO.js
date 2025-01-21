export class roleDTO {
	static toResponse(data) {
		if (Array.isArray(data.roles)) {
			return data.roles.map(role => ({
				id_rol: role.id_rol,
				type: role.type,
				createdAt: role.createdAt,
				updatedAt: role.updatedAt,
			}))
		}

		return {
			id_rol: data.id_rol,
			type: data.type,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
		}
	}
}
