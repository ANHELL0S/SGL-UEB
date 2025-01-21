import { UserDTO } from '../../domain/dtos/userDTO.js'
import { UserRepository } from '../../application/repository/userRepository.js'
import { hashPassword } from '../../../../shared/helpers/bcrypt-helper.js'

export class UserService {
	static async getAllUsers(page, limit, search, id) {
		const offset = (page - 1) * limit
		const result = await UserRepository.findAllUsers(offset, limit, search, id)
		return {
			totalRecords: result.count,
			totalPages: Math.ceil(result.count / limit),
			currentPage: parseInt(page, 10),
			recordsPerPage: parseInt(limit, 10),
			users: result.rows.map(user => UserDTO.toResponse(user)),
		}
	}

	static async getUserById(id) {
		const userFound = await UserRepository.findUserById(id)
		return userFound ? UserDTO.toResponse(userFound) : null
	}

	static async createUser(data, transaction) {
		const existingEmail = await UserRepository.findUserByField('email', data.email)
		if (existingEmail) return { error: 'El correo electrónico ya está en uso.' }

		const existingPhone = await UserRepository.findUserByField('phone', data.phone)
		if (existingPhone) return { error: 'El número de teléfono ya está en uso.' }

		const existingIdentificationCard = await UserRepository.findUserByField('identification_card', data.dni)
		if (existingIdentificationCard) return { error: 'La cédula de identidad ya está en uso.' }

		const existingCode = await UserRepository.findUserByField('code', data.code)
		if (existingCode) return { error: 'El código ya está en uso.' }

		const hashedPassword = await hashPassword(data.dni)

		const userData = UserDTO.transformData({ ...data, password: hashedPassword })
		const createdUser = await UserRepository.createUser(userData, transaction)

		await UserRepository.userRolesIntermediate({ id_user_fk: createdUser.id_user }, transaction)

		return { user: createdUser }
	}

	static async managerUserRoles(data, transaction) {
		const existingUser = await UserRepository.findUserById(data.id_user)
		if (!existingUser) return { status: 404, error: 'Usuario no encontrado' }

		const userRolesIntermediate = await UserRepository.finduserRolesIntermediate(data.id_user)
		if (!userRolesIntermediate) return { status: 404, error: 'Error no se encontraron relación de roles.' }

		await UserRepository.deleteRolesToUser(userRolesIntermediate.id_user_role_intermediate, transaction)

		const userRolesData = {
			...data,
			userRolesIntermediate,
		}
		await UserRepository.assignRolesToUser(userRolesData, transaction)
		return true
	}

	static async updateUser(id, data, transaction) {
		const existingEmail = await UserRepository.findUserByFieldExcept('email', data.email, id)
		if (existingEmail) return { error: 'El correo electrónico ya está en uso.' }

		const existingPhone = await UserRepository.findUserByFieldExcept('phone', data.phone, id)
		if (existingPhone) return { error: 'El número de teléfono ya está en uso.' }

		const existingIdentificationCard = await UserRepository.findUserByFieldExcept('identification_card', data.dni, id)
		if (existingIdentificationCard) return { error: 'La cédula de identidad ya está en uso.' }

		const existingCode = await UserRepository.findUserByFieldExcept('code', data.code, id)
		if (existingCode) return { error: 'El código ya está en uso.' }

		const userData = UserDTO.transformData({ ...data })
		const updatedUser = await UserRepository.updateUser(id, userData, transaction)

		return { user: updatedUser }
	}

	static async changeStatusUser(id, data, transaction) {
		if (data.hasOwnProperty('active')) data.active = !data.active

		const userData = UserDTO.transformData({ ...data })
		const updatedUser = await UserRepository.updateUser(id, userData, transaction)

		return { user: updatedUser }
	}

	static async deleteUser(id, transaction) {
		const associatedAnalyst = await UserRepository.findLaboratoryAnalyst(id)
		if (associatedAnalyst) return { error: 'Usuario asignado a un laboratorio.' }
		const associatedAccessLab = await UserRepository.findAccessLab(id)
		if (associatedAccessLab) return { error: 'Usuario responsable de un acceso.' }
		return UserRepository.deleteUser(id, transaction)
	}
}
