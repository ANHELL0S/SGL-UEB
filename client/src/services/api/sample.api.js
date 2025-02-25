import { ApiService } from './_main'
import { sampleInstance } from '../../config/instances'

export class SampleService extends ApiService {
	static instance = sampleInstance

	static async getAllRequest(page, limit, search) {
		try {
			const response = await this.instance.get('/', { params: { page, limit, search } })
			return response.data
		} catch (error) {
			throw error.response?.data
		}
	}

	static async getAllSampleToQuoteRequest(id, limit, page, search) {
		try {
			const response = await this.instance.get(`/${id}/pertain-quote`, { params: { page, limit, search } })
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

	static async createSampleRequest(data) {
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

	static async addResultRequest(data) {
		try {
			return await this.instance.post('/result', data)
		} catch (error) {
			throw error.response?.data
		}
	}

	static async UpdateResultRequest(id, data) {
		try {
			return await this.instance.put(`/result/${id}`, data)
		} catch (error) {
			throw error.response?.data
		}
	}

	static async deletePeramanentResultRequest(id) {
		try {
			return await this.instance.delete(`/result/${id}/permanent`)
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

	static async generateReport(id) {
		try {
			const response = await this.instance.get(`/${id}/report`, { responseType: 'blob' })
			return response.data
		} catch (error) {
			throw error.response?.data
		}
	}

	static async generateReportDocx(id, data) {
		try {
			const response = await this.instance.get(`/${id}/report-docx`, {
				params: data,
				responseType: 'blob',
			})
			return response.data
		} catch (error) {
			throw error.response?.data
		}
	}
}
