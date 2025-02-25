import jwt from 'jsonwebtoken'
import { env } from '../../config/env-config.js'
import { token_Schema } from '../../schema/schemes.js'
import { sendResponse } from '../../shared/helpers/responseHandler-helper.js'

export const Auth = async (req, res, next) => {
	try {
		const { accessToken } = req.cookies

		// Verifica si el token está presente
		if (!accessToken) return sendResponse(res, 401, 'Autenticación requerida. Por favor inicia sesión.')

		// Busca el token en la base de datos
		const tokenRecord = await token_Schema.findOne({ where: { token: accessToken } })
		if (!tokenRecord)
			return sendResponse(res, 401, 'Token no válido o no registrado. Por favor vuelve a iniciar sesión.')

		// Verifica si el token ha expirado
		if (tokenRecord.expired)
			return sendResponse(res, 401, 'El token ya fue utilizado o está expirado. Por favor vuelve a iniciar sesión.')

		// Verifica el token JWT
		jwt.verify(accessToken, env.JWT_SECRET, (error, user) => {
			if (error) return sendResponse(res, 401, 'Tu sesión actual ha expirado, por favor vuelve a iniciar sesión.')
			req.user = user // Adjunta el usuario decodificado a la solicitud
			next() // Solo llama a next() si no hay errores
		})
	} catch (error) {
		console.error('Error en el middleware de autenticación:', error)
		return sendResponse(res, 500, 'Error interno del servidor.')
	}
}
