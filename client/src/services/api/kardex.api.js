import { ApiService } from './_main'
import { kardexInstance } from '../../config/instances'

export class KardexService extends ApiService {
	static instance = kardexInstance

	static async getAllRequest(page, limit, search) {
		try {
			const response = await this.instance.get('/', { params: { page, limit, search } })
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

	static async getByIdRequest(id) {
		try {
			const response = await this.instance.get(`/${id}`)
			return response.data
		} catch (error) {
			throw error.response?.data
		}
	}
}

export const getReportRequest = async (startDate, endDate, search, movementType, control_tracking, selectedUsers) => {
	try {
		const response = await kardexInstance.get('/report/pdf', {
			params: { startDate, endDate, search, movementType, control_tracking, selectedUsers },
			responseType: 'blob',
		})

		const blob = new Blob([response.data], { type: 'application/pdf' })
		const url = URL.createObjectURL(blob)

		const link = document.createElement('a')
		link.href = url

		// Generar fecha actual para el nombre del archivo
		const currentDate = new Date().toISOString().split('T')[0]
		link.download = `Reporte_Kardex_${currentDate}.pdf`

		document.body.appendChild(link) // Agregar al DOM para compatibilidad
		link.click()
		document.body.removeChild(link) // Remover del DOM
		URL.revokeObjectURL(url) // Liberar memoria
		return response
	} catch (error) {
		throw error.response
	}
}
