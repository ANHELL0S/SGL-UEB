import { ApiService } from './_main'
import { experimentCategoryInstance, experimentParameterInstance } from '../../config/instances'

export class CategoryService extends ApiService {
	static instance = experimentCategoryInstance

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

	static async deleteRequest(id, data) {
		try {
			return await this.instance.delete(`/${id}`, data)
		} catch (error) {
			throw error.response?.data
		}
	}

	static async restoreRequest(id, data) {
		try {
			return await this.instance.put(`/${id}/restore`, data)
		} catch (error) {
			throw error.response?.data
		}
	}

	static async deletePermanentRequest(id, data) {
		try {
			return await this.instance.delete(`/${id}/permanent`, data)
		} catch (error) {
			throw error.response?.data
		}
	}
}

export class ParameterService extends ApiService {
	static instance = experimentParameterInstance

	static async getAllRequest(page, limit, search) {
		try {
			const response = await this.instance.get('/', { params: { page, limit, search } })
			return response.data
		} catch (error) {
			throw error.response?.data
		}
	}

	static async getAllToAccessRequest(id) {
		try {
			const response = await this.instance.get(`/${id}/access`)
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

	static async restoreRequest(id, data) {
		try {
			return await this.instance.put(`/${id}/restore`, data)
		} catch (error) {
			throw error.response?.data
		}
	}

	static async deletePermanentRequest(id, data) {
		try {
			return await this.instance.delete(`/${id}/permanent`, data)
		} catch (error) {
			throw error.response?.data
		}
	}
}
