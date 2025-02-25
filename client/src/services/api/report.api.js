import { ApiService } from './_main'
import { reportInstance } from '../../config/instances'

export class ReportService extends ApiService {
	static instance = reportInstance

	static async getAllRequest(page, limit, search) {
		try {
			const response = await this.instance.get('/', { params: { page, limit, search } })
			return response.data
		} catch (error) {
			throw error.response?.data
		}
	}

	static async getAllReportPertainToSampleRequest(id, limit, page, search) {
		try {
			const response = await this.instance.get(`/${id}/pertain-sample`, { params: { page, limit, search } })
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

	static async changeStatusReportRequest(id, data) {
		try {
			return await this.instance.put(`/${id}/change-status`, data)
		} catch (error) {
			throw error.response?.data
		}
	}

	static async deleteReportRequest(id, data) {
		try {
			return await this.instance.delete(`/${id}`, data)
		} catch (error) {
			throw error.response?.data
		}
	}
}

export const getReportRequest = async (startDate, endDate, search, statusReport, selectedSample, selectedUsers) => {
	try {
		const response = await reportInstance.get('/report', {
			params: { startDate, endDate, search, statusReport, selectedSample, selectedUsers },
			responseType: 'blob',
		})

		const blob = new Blob([response.data], { type: 'application/pdf' })
		const url = URL.createObjectURL(blob)

		const link = document.createElement('a')
		link.href = url

		// Generar fecha actual para el nombre del archivo
		const currentDate = new Date().toISOString().split('T')[0]
		link.download = `Reporte_informes_${currentDate}.pdf`

		document.body.appendChild(link) // Agregar al DOM para compatibilidad
		link.click()
		document.body.removeChild(link) // Remover del DOM
		URL.revokeObjectURL(url) // Liberar memoria
		return response
	} catch (error) {
		throw error.response
	}
}
