import { ApiService } from './_main'
import { labInstance } from '../../config/instances'

export class LabService extends ApiService {
	static instance = labInstance

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

	static async findLabToNameRequest(id) {
		try {
			const response = await this.instance.get(`/${id}/find-name`)
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

	static async createAssignLabAnalystRequest(data) {
		try {
			return await this.instance.post('/assing-analyst', data)
		} catch (error) {
			throw error.response?.data
		}
	}

	static async removeAnalystLabRequest(id) {
		try {
			return await this.instance.delete(`/${id}/assing-analyst`)
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

	static async deleteLabRequest(id, data) {
		try {
			return await this.instance.delete(`/${id}`, data)
		} catch (error) {
			throw error.response?.data
		}
	}

	static async deletePermanentLabRequest(id, data) {
		try {
			return await this.instance.delete(`/${id}/permanent`, data)
		} catch (error) {
			throw error.response?.data
		}
	}

	static async restoreLabRequest(id, data) {
		try {
			return await this.instance.put(`/${id}/restore`, data)
		} catch (error) {
			throw error.response?.data
		}
	}
}

export const getReportLabsRequest = async (startDate, endDate) => {
	try {
		const response = await labInstance.get('/report/pdf', {
			params: { startDate, endDate },
			responseType: 'blob',
		})

		const blob = response.data

		const link = document.createElement('a')
		link.href = URL.createObjectURL(blob)

		link.download = `Reporte_Laboratorios_${currentDate}.pdf`

		link.click()
	} catch (error) {
		throw new Error(`${error.response.status}`)
	}
}
