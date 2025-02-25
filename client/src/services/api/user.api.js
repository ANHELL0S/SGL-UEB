import { ApiService } from './_main'
import { userInstance } from '../../config/instances'

export class UserService extends ApiService {
	static instance = userInstance

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

	static async getInfoUserRequest(id) {
		try {
			const response = await this.instance.get('/me')
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

	static async managerUserRolesRequest(data) {
		try {
			return await this.instance.post('/manager-role', data)
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

	static async updateAccountRequest(data) {
		try {
			return await this.instance.put('/', data)
		} catch (error) {
			throw error.response?.data
		}
	}

	static async updatePasswordRequest(data) {
		try {
			return await this.instance.put('/password', data)
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

	static async restoreRequest(id) {
		try {
			return await this.instance.put(`/${id}/restore`)
		} catch (error) {
			throw error.response?.data
		}
	}
}

export const getReportUserRequest = async (startDate, endDate) => {
	try {
		const response = await userInstance.get('/report/pdf', {
			params: { startDate, endDate },
			responseType: 'blob',
		})

		const blob = response.data

		const link = document.createElement('a')
		link.href = URL.createObjectURL(blob)

		link.download = `Reporte_Usuarios_${currentDate}.pdf`

		link.click()
	} catch (error) {
		throw new Error(`${error.response.status}`)
	}
}
