import { logEvent } from '../../../../shared/helpers/logger-helper.js'
import { RoleService } from '../../application/services/roleService.js'
import { RedisCache } from '../../../../shared/services/redis-service.js'
import { REDIS_KEYS } from '../../../../shared/constants/redisKey-const.js'
import { params_schema_zod } from '../../validators/roleSchema.js'
import { sendResponse } from '../../../../shared/helpers/responseHandler-helper.js'

export class RoleController {
	static async getAllRoles(req, res) {
		const cacheKey = `cache:${REDIS_KEYS.USERS.ROLE}`

		try {
			const rolesCache = await RedisCache.getFromCache(cacheKey)
			if (rolesCache) return sendResponse(res, 200, 'Roles obtenidos exitosamente.', rolesCache)

			const rolesFound = await RoleService.getAllRoles()
			await RedisCache.setInCache(cacheKey, rolesFound)

			return sendResponse(res, 200, 'Roles obtenidos exitosamente.', rolesFound)
		} catch (error) {
			await logEvent(
				'error',
				'Error al obtener los usuarios.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			return sendResponse(res, 500)
		}
	}

	static async getRoleById(req, res) {
		const cacheKey = `cache:${REDIS_KEYS.USERS.ROLE}:${req?.params?.id}`

		try {
			const parsedData = params_schema_zod.safeParse(req?.params)
			if (!parsedData.success) return sendResponse(res, 400, parsedData.error.errors[0].message)

			const roleCache = await RedisCache.getFromCache(cacheKey)
			if (roleCache) return sendResponse(res, 200, 'Rol obtenido exitosamente.', roleCache)

			const roleFound = await RoleService.getRoleById(req?.params?.id)
			if (!roleFound) return sendResponse(res, 404, 'Rol no encontrado.', null)

			await RedisCache.setInCache(cacheKey, roleFound)

			return sendResponse(res, 200, 'Rol obtenido exitosamente.', roleFound)
		} catch (error) {
			await logEvent(
				'error',
				'Error al obtener el rol.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			return sendResponse(res, 500)
		}
	}

	static async getMeRole(req, res) {
		const cacheKey = `cache:${REDIS_KEYS.USERS.ROLE}:me:${req?.user?.id}`

		try {
			const roleCache = await RedisCache.getFromCache(cacheKey)
			if (roleCache) return sendResponse(res, 200, 'Roles obtenido exitosamente.', roleCache)

			const rolesFound = await RoleService.getMeRoles(req?.user?.id)
			if (!rolesFound) return sendResponse(res, 404, 'Roles no encontrado.', null)
			await RedisCache.setInCache(cacheKey, rolesFound)

			return sendResponse(res, 200, 'Roles obtenido exitosamente.', rolesFound)
		} catch (error) {
			await logEvent(
				'error',
				'Error al obtener los roles del usuario.',
				{ error: error.message, stack: error.stack },
				req?.user?.id,
				req
			)
			return sendResponse(res, 500)
		}
	}
}
