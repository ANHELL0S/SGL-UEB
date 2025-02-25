import { ApiService } from './_main'
import { logInstance } from '../../config/instances'

export class LogService extends ApiService {
	static instance = logInstance

	static async getAllRequest(page, limit, search) {
		try {
			const response = await this.instance.get('/', { params: { page, limit, search } })
			return response.data
		} catch (error) {
			throw error.response?.data
		}
	}
}
