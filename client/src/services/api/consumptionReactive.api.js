import { ApiService } from './_main'
import { consumptionReactiveInstance } from '../../config/instances'

export class ConsumptionReactiveService extends ApiService {
	static instance = consumptionReactiveInstance

	static async getAllRequest(page, limit, search) {
		try {
			const response = await this.instance.get('/', { params: { page, limit, search } })
			return response.data
		} catch (error) {
			throw error.response?.data
		}
	}

	static async getAllToAccessRequest(id, page, limit, search) {
		try {
			const response = await this.instance.get(`/${id}/pertain-access`, { params: { page, limit, search } })
			return response.data
		} catch (error) {
			throw error.response?.data
		}
	}

	static async getAllConsumptionPertainToAnalystRequest(page, limit, search) {
		try {
			const response = await this.instance.get('/pertain-user', { params: { page, limit, search } })
			return response.data
		} catch (error) {
			throw error.response?.data
		}
	}

	static async createRequest(data) {
		try {
			return await this.instance.post('/', data)
		} catch (error) {
			throw error.response?.data
		}
	}

	static async createIndependentRequest(data) {
		try {
			return await this.instance.post('/independent', data)
		} catch (error) {
			throw error.response?.data
		}
	}

	static async updateRequest(id, data) {
		try {
			return await this.instance.put(`/${id}`, data)
		} catch (error) {
			throw error.response?.data
		}
	}

	static async deletePeramanentRequest(id, data) {
		try {
			return await this.instance.delete(`/${id}/permanent`, data)
		} catch (error) {
			throw error.response?.data
		}
	}

	static async deleteIndependentPeramanentRequest(id, data) {
		try {
			return await this.instance.delete(`/${id}/independent`, data)
		} catch (error) {
			throw error.response?.data
		}
	}
}
