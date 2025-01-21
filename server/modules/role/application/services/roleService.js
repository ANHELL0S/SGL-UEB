import { roleDTO } from '../../domain/dtos/roleDTO.js'
import { RoleRepository } from '../repository/roleRepository.js'

export class RoleService {
	static async getAllRoles() {
		const rolesFound = await RoleRepository.findAllRoles()
		return rolesFound ? roleDTO.toResponse(rolesFound) : null
	}

	static async getRoleById(id) {
		const roleFound = await RoleRepository.findRoleById(id)
		return roleFound ? roleDTO.toResponse(roleFound) : null
	}

	static async getMeRoles(id) {
		const meRolesFound = await RoleRepository.findMeRoles(id)
		return meRolesFound ? roleDTO.toResponse(meRolesFound) : null
	}
}
