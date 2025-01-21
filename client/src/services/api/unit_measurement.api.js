import { unitsMeasurementInstance } from '../../config/instances'

export const getAllUnitMeasurementRequest = async (page, limit, search) => {
	try {
		const response = await unitsMeasurementInstance.get('/', {
			params: { page, limit, search },
		})
		return response.data
	} catch (error) {
		throw new Error(`${error.response.data.message}`)
	}
}

export const getUnitMeasurementByIdRequest = async id => {
	try {
		const response = await unitsMeasurementInstance.get(`/${id}`)
		return response.data
	} catch (error) {
		throw new Error(`${error.response.data.message}`)
	}
}

export const createUnitMeasurementRequest = async data => {
	try {
		const response = await unitsMeasurementInstance.post('/', data)
		return response.data
	} catch (error) {
		throw new Error(`${error.response.data.message}`)
	}
}

export const updateUnitMeasurementRequest = async (id, data) => {
	try {
		const response = await unitsMeasurementInstance.put(`/${id}`, data)
		return response.data
	} catch (error) {
		throw new Error(`${error.response.data.message}`)
	}
}

export const deleteUnitMeasurementRequest = async id => {
	try {
		const response = await unitsMeasurementInstance.delete(`/${id}`)
		return response.data
	} catch (error) {
		throw new Error(`${error.response.data.message}`)
	}
}
