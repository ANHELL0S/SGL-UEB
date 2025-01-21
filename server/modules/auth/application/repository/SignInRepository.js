import { user_Schema, user_roles_Schema, rol_Schema, user_role_main_Schema } from '../../../../schema/schemes.js'

export class SignInRepository {
	static async findUserByEmail(email) {
		return user_Schema.findOne({
			where: { email },
			include: [
				{
					model: user_role_main_Schema,
					include: [
						{
							model: user_roles_Schema,
						},
					],
				},
			],
		})
	}

	static async findUserRolesByIntermediateId(id) {
		return user_roles_Schema.findAll({
			where: { id_user_role_intermediate_fk: id },
			include: [
				{
					model: rol_Schema,
				},
			],
		})
	}
}
