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
}
