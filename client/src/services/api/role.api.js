import { roleInstance } from '../../config/instances'

export const getAllRolesRequest = async () => {
	try {
		const response = await roleInstance.get('/')
		return response.data
	} catch (error) {
		throw error.response?.data
	}
}

export const getRoleByIdRequest = async id => {
	try {
		const response = await roleInstance.get(`/${id}`)
		return response.data
	} catch (error) {
		throw error.response?.data
	}
}

export const getMeRoleRequest = async () => {
	try {
		const response = await roleInstance.get('/my-roles')
		return response.data
	} catch (error) {
		throw error.response?.data
	}
}
