export class roleEntity {
	constructor(data) {
		if (Array.isArray(data)) {
			this.roles = data.map(role => ({
				id_rol: role.id_rol,
				type: role.type_rol,
				createdAt: role.createdAt,
				updatedAt: role.updatedAt,
			}))
		} else {
			this.id_rol = data.id_rol
			this.type = data.type_rol
			this.createdAt = data.createdAt
			this.updatedAt = data.updatedAt
		}
	}

	toPlainObject() {
		if (this.roles) return this.roles

		return {
			id_rol: this.id_rol,
			type: this.type,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		}
	}
}
