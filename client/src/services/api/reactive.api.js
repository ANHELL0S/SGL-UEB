import { ApiService } from './_main'
import { reactiveInstance } from '../../config/instances'

export class ReactiveService extends ApiService {
	static instance = reactiveInstance

	static async getAllRequest(page, limit, search) {
		try {
			const response = await this.instance.get('/', { params: { page, limit, search } })
			return response.data
		} catch (error) {
			throw error.response?.data
		}
	}

	static async getByIdRequest(id) {
		try {
			const response = await this.instance.get(`/${id}`)
			return response.data
		} catch (error) {
			throw error.response?.data
		}
	}

	static async uploadedFileRequest(data) {
		try {
			return await this.instance.post('/upload-file', data)
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

	static async updateRequest(id, data) {
		try {
			return await this.instance.put(`/${id}`, data)
		} catch (error) {
			throw error.response?.data
		}
	}

	static async changeStatusRequest(id, data) {
		try {
			return await this.instance.put(`/${id}/status`, data)
		} catch (error) {
			throw error.response?.data
		}
	}

	static async deleteRequest(id, data) {
		try {
			return await this.instance.delete(`/${id}`, data)
		} catch (error) {
			throw error.response?.data
		}
	}

	static async restoreRequest(id) {
		try {
			return await this.instance.put(`/${id}/restore`)
		} catch (error) {
			throw error.response?.data
		}
	}

	static async deletePermanentRequest(id) {
		try {
			return await this.instance.delete(`/${id}/permanent`)
		} catch (error) {
			throw error.response?.data
		}
	}
}
