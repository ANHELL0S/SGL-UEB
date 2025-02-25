import { user_data } from './user_data.js'
import { hashPassword } from '../../shared/helpers/bcrypt-helper.js'
import { user_Schema, rol_Schema, user_roles_Schema, user_role_main_Schema } from '../../schema/schemes.js'

const userSeeder = async () => {
	let usersCreated = false

	try {
		const existingUsers = await user_Schema.findAll()
		if (existingUsers.length > 0) {
			console.log('Seeder -> Usuarios ya existen el Seeder no se ejecuta.')
			return
		}

		const allRoles = await rol_Schema.findAll()
		const roleMap = allRoles.reduce((map, role) => {
			map[role.type_rol] = role.id_rol
			return map
		}, {})

		for (const user of user_data) {
			const hashedPassword = await hashPassword(user.email)
			const createdUser = await user_Schema.create({
				...user,
				password: hashedPassword,
			})

			const userRoleMain = await user_role_main_Schema.create({
				id_user_fk: createdUser.id_user,
			})

			const userRoles = user.roles

			for (const roleName of userRoles) {
				const roleId = roleMap[roleName]
				if (roleId) {
					await user_roles_Schema.create({
						id_user_role_intermediate_fk: userRoleMain.id_user_role_intermediate,
						id_rol_fk: roleId,
					})
				} else {
					console.error(`Rol no encontrado: ${roleName} para el usuario ${user.full_name}`)
				}
			}

			usersCreated = true
		}

		if (usersCreated) console.log('Seeder -> Usuarios y asignación de roles creados exitosamente.')
	} catch (error) {
		console.error('Error al crear usuarios predeterminados:', error)
	}
}

export { userSeeder }
