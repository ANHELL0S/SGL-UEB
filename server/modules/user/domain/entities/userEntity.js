export class UserEntity {
	constructor({
		id_user,
		active,
		full_name,
		email,
		phone,
		identification_card,
		user_roles_intermediate,
		password,
		code,
		createdAt,
		updatedAt,
		deletedAt,
	}) {
		this.id = id_user
		this.active = active
		this.fullName = full_name
		this.email = email
		this.phone = phone
		this.identificationCard = identification_card
		this.roles = this.processRoles(user_roles_intermediate)
		this.password = password
		this.code = code
		this.createdAt = createdAt
		this.updatedAt = updatedAt
		this.deletedAt = deletedAt
	}

	processRoles(user_roles_intermediate) {
		if (user_roles_intermediate && Array.isArray(user_roles_intermediate.user_roles)) {
			return user_roles_intermediate.user_roles.map(role => {
				const roleData = role.dataValues.role ? role.dataValues.role.dataValues : null
				if (roleData) {
					return {
						id_rol: roleData.id_rol,
						type_rol: roleData.type_rol,
					}
				} else {
					return {}
				}
			})
		}
		return []
	}

	isActive() {
		return this.active
	}

	hideSensitiveData() {
		return {
			id: this.id,
			active: this.active,
			fullName: this.fullName,
			email: this.email,
			phone: this.phone,
			identificationCard: this.identificationCard,
			code: this.code,
			roles: this.roles,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
			deletedAt: this.this.deletedAt,
		}
	}
}
