import { ApiService } from './_main'
import { quotesInstance } from '../../config/instances'

export class QuoteService extends ApiService {
	static instance = quotesInstance

	// QUOTE
	static async getAllRequest(page, limit, search) {
		try {
			const response = await this.instance.get('/', { params: { page, limit, search } })
			return response.data
		} catch (error) {
			throw error.response?.data
		}
	}
	static async getAllQuotesPertainToAnalystRequest(page, limit, search) {
		try {
			const response = await this.instance.get('/pertain-to-analyst', { params: { page, limit, search } })
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

	static async getByCodeRequest(code) {
		try {
			const response = await this.instance.get(`/${code}/by-code`)
			return response.data
		} catch (error) {
			throw error.response?.data
		}
	}

	static async createQuoteRequest(data) {
		try {
			return await this.instance.post('/', data)
		} catch (error) {
			throw error.response?.data
		}
	}

	static async addBillRequest(id, data) {
		try {
			return await this.instance.put(`/${id}/bill`, data)
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

	static async deletePermanentRequest(id, data) {
		try {
			return await this.instance.delete(`/${id}/permanent`, data)
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

	// ASIGNED LAB
	static async getAllAsignedLabRequest(id) {
		try {
			return await this.instance.get(`/${id}/lab-asigned`)
		} catch (error) {
			throw error.response?.data
		}
	}

	static async asignedLabRequest(data) {
		try {
			return await this.instance.post('/lab-asigned', data)
		} catch (error) {
			throw error.response?.data
		}
	}

	static async deleteLabAsignedLabRequest(id) {
		try {
			return await this.instance.delete(`/${id}/lab-asigned`)
		} catch (error) {
			throw error.response?.data
		}
	}
}
