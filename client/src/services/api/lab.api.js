import { labInstance } from '../../config/instances'

export const getAllLabsRequest = async (page, limit, search) => {
	try {
		const response = await labInstance.get('/', {
			params: { page, limit, search },
		})
		return response.data
	} catch (error) {
		throw new Error(`${error.response.data.message}`)
	}
}

export const getLabByIdRequest = async id => {
	try {
		const response = await labInstance.get(`/${id}`)
		return response.data
	} catch (error) {
		throw new Error(`${error.response.data.message}`)
	}
}

export const findLabToNameRequest = async name => {
	try {
		const response = await labInstance.get(`/${name}/find-name`)
		return response.data
	} catch (error) {
		throw new Error(`${error.response.data.message}`)
	}
}

export const createLabRequest = async data => {
	try {
		const response = await labInstance.post('/', data)
		return response.data
	} catch (error) {
		throw new Error(`${error.response.data.message}`)
	}
}

export const updateLabRequest = async (id, data) => {
	try {
		const response = await labInstance.put(`/${id}`, data)
		return response.data
	} catch (error) {
		throw new Error(`${error.response.data.message}`)
	}
}

export const createAssignLabAnalystRequest = async data => {
	try {
		const response = await labInstance.post('/assing-analyst', data)
		return response.data
	} catch (error) {
		throw new Error(`${error.response.data.message}`)
	}
}

export const changeStatusLabRequest = async (id, data) => {
	try {
		const response = await labInstance.put(`/${id}/status`, data)
		return response.data
	} catch (error) {
		throw new Error(`${error.response.data.message}`)
	}
}

export const deleteLabRequest = async id => {
	try {
		const response = await labInstance.delete(`/${id}`)
		return response.data
	} catch (error) {
		throw new Error(`${error.response.data.message}`)
	}
}

export const removeAnalystLabRequest = async id => {
	try {
		const response = await labInstance.delete(`/${id}/assing-analyst`)
		return response.data
	} catch (error) {
		throw new Error(`${error.response.data.message}`)
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
