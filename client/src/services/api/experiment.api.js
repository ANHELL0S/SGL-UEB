import { experimentInstance } from '../../config/instances'

export const getAllExperimentsRequest = async (page, limit, search) => {
	try {
		const response = await experimentInstance.get('/', {
			params: { page, limit, search },
		})
		return response.data
	} catch (error) {
		throw new Error(`${error.response.data.message}`)
	}
}

export const createExperimentRequest = async data => {
	try {
		const response = await experimentInstance.post('/', data)
		return response.data
	} catch (error) {
		throw new Error(`${error.response.data.message}`)
	}
}

export const updateExperimentRequest = async (id, data) => {
	try {
		const response = await experimentInstance.put(`/${id}`, data)
		return response.data
	} catch (error) {
		throw new Error(`${error.response.data.message}`)
	}
}

export const changeStatusExperimentRequest = async (id, data) => {
	try {
		const response = await experimentInstance.put(`/${id}/status`, data)
		return response.data
	} catch (error) {
		throw new Error(`${error.response.data.message}`)
	}
}

export const deleteExperimentRequest = async id => {
	try {
		const response = await experimentInstance.delete(`/${id}`)
		return response.data
	} catch (error) {
		throw new Error(`${error.response.data.message}`)
	}
}
