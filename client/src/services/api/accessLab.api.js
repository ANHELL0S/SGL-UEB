import { accessLabInstance } from '../../config/instances'

export const getAllAccessLabsRequest = async (page, limit, search) => {
	try {
		const response = await accessLabInstance.get('/', {
			params: { page, limit, search },
		})
		return response.data
	} catch (error) {
		throw new Error(`${error.response.data.message}`)
	}
}

export const getAllAccessPertainLabRequest = async (id, page, limit, search) => {
	try {
		const response = await accessLabInstance.get(`/${id}/pertain-lab`, {
			params: { page, limit, search },
		})
		return response.data
	} catch (error) {
		throw new Error(`${error.response.data.message}`)
	}
}

export const getAccessLabByIdRequest = async id => {
	try {
		const response = await accessLabInstance.get(`/${id}`)
		return response.data
	} catch (error) {
		throw new Error(`${error.response.data.message}`)
	}
}

export const createAccessLabRequest = async data => {
	try {
		const response = await accessLabInstance.post('/', data)
		return response.data
	} catch (error) {
		throw new Error(`${error.response.data.message}`)
	}
}

export const updateAccessLabRequest = async (id, data) => {
	try {
		const response = await accessLabInstance.put(`/${id}`, data)
		return response.data
	} catch (error) {
		throw new Error(`${error.response.data.message}`)
	}
}

export const deleteAccessLabRequest = async id => {
	try {
		const response = await accessLabInstance.delete(`/${id}`)
		return response.data
	} catch (error) {
		throw new Error(`${error.response.data.message}`)
	}
}

export const changeStatusAccessLabRequest = async (id, data) => {
	try {
		const response = await accessLabInstance.put(`/${id}/status`, data)
		return response.data
	} catch (error) {
		throw new Error(`${error.response.data.message}`)
	}
}
