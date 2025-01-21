import { TIME_KEY_VALID } from '../constants/redisKey-const.js'
import { createRedisClient } from '../../config/redis-config.js'

export class RedisCache {
	static async getFromCache(cacheKey) {
		const redisClient = createRedisClient()
		try {
			const cachedData = await redisClient.get(cacheKey)
			return cachedData ? JSON.parse(cachedData) : null
		} catch (error) {
			console.error('Error obteniendo datos del caché de Redis:', error)
			return null
		} finally {
			redisClient.disconnect()
		}
	}

	static async setInCache(cacheKey, data) {
		const redisClient = createRedisClient()
		try {
			await redisClient.set(cacheKey, JSON.stringify(data), 'EX', TIME_KEY_VALID)
		} catch (error) {
			console.error('Error estableciendo datos en el caché de Redis:', error)
		} finally {
			redisClient.disconnect()
		}
	}

	static async clearCache(cacheKeys) {
		const redisClient = createRedisClient()
		try {
			for (const cacheKey of cacheKeys) {
				const keys = await redisClient.keys(cacheKey)
				if (keys.length > 0) await redisClient.del(...keys)
			}
		} catch (error) {
			console.error(`Error al borrar el caché de Redis con el patrón ${cacheKeys}:`, error)
		} finally {
			redisClient.disconnect()
		}
	}
}
