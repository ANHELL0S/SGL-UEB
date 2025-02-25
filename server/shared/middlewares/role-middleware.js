import { rol_Schema, user_Schema } from '../../schema/schemes.js'
import { sendResponse } from '../../shared/helpers/responseHandler-helper.js'

async function checkUserRole(req, res, next, roles) {
	try {
		const { user } = req

		const user_data = await user_Schema.findByPk(user.id)
		if (!user_data) return sendResponse(res, 404, 'Usuario no encontrado.')

		const userRoles = await rol_Schema.findAll({
			where: { id_rol: user.roles },
		})

		const validRoles = userRoles.map(role => role.type_rol)
		const hasValidRole = validRoles.some(role => roles.includes(role))

		if (!hasValidRole) return sendResponse(res, 403, 'No tienes permiso para realizar esta acción.')

		next()
	} catch (error) {
		return sendResponse(res, 500)
	}
}

export function hasRole(roles) {
	return (req, res, next) => checkUserRole(req, res, next, roles)
}
