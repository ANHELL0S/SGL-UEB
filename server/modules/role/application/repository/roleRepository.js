import { rol_Schema, user_role_main_Schema, user_roles_Schema, user_Schema } from '../../../../schema/schemes.js'
import { roleEntity } from '../../domain/entities/roleEntity.js'

export class RoleRepository {
	static async findAllRoles() {
		const rolesFound = await rol_Schema.findAll({
			subQuery: false,
			distinct: true,
			order: [['createdAt', 'DESC']],
		})

		return rolesFound ? new roleEntity(rolesFound) : null
	}

	static async findRoleById(id) {
		const roleFound = await rol_Schema.findByPk(id)
		return roleFound ? new roleEntity(roleFound) : null
	}

	static async findMeRoles(id) {
		const userRolesFound = await user_Schema.findByPk(id, {
			include: [
				{
					model: user_role_main_Schema,
					include: [
						{
							model: user_roles_Schema,
							include: [{ model: rol_Schema }],
						},
					],
				},
			],
		})
		const roles = userRolesFound.user_roles_intermediate.user_roles.map(userRole => {
			const roleData = userRole.role?.dataValues
			return {
				id_rol: roleData?.id_rol,
				type: roleData?.type_rol,
				createdAt: roleData?.createdAt,
				updatedAt: roleData?.updatedAt,
			}
		})

		return userRolesFound ? new roleEntity(roles) : null
	}
}
