import { reactiveInstance } from '../../config/instances'

export const getAllReactivesRequest = async (page, limit, search) => {
	try {
		const response = await reactiveInstance.get('/', {
			params: { page, limit, search },
		})
		return response.data
	} catch (error) {
		throw new Error(`${error.response.data.message}`)
	}
}

export const getReactiveByIdRequest = async id => {
	try {
		const response = await reactiveInstance.get(`/${id}`)
		return response.data
	} catch (error) {
		throw new Error(`${error.response.data.message}`)
	}
}

export const uploadedFileRequest = async data => {
	try {
		const response = await reactiveInstance.post('/upload-file', data)
		return response.data
	} catch (error) {
		throw new Error(`${error.response.data.message}`)
	}
}

export const createReactiveRequest = async data => {
	try {
		const response = await reactiveInstance.post('/', data)
		return response.data
	} catch (error) {
		throw new Error(`${error.response.data.message}`)
	}
}

export const changeStatusReactiveRequest = async (id, data) => {
	try {
		const response = await reactiveInstance.put(`/${id}/status`, data)
		return response.data
	} catch (error) {
		throw new Error(`${error.response.data.message}`)
	}
}
