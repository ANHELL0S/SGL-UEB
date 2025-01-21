import { userInstance } from '../../config/instances'
import { currentDate } from '../../helpers/dateTimeZone.helper'

export const getInfoUserRequest = async () => {
	try {
		const response = await userInstance.get('/me')
		return response.data
	} catch (error) {
		throw new Error(`${error.response.data.message}`)
	}
}

export const getAllUsersRequest = async (page, limit, search) => {
	try {
		const response = await userInstance.get('/', {
			params: { page, limit, search },
		})
		return response.data
	} catch (error) {
		throw new Error(`${error.response.data.message}`)
	}
}

export const createUserRequest = async data => {
	try {
		const response = await userInstance.post('/', data)
		return response.data
	} catch (error) {
		throw new Error(`${error.response.data.message}`)
	}
}

export const managerUserRolesRequest = async data => {
	try {
		const response = await userInstance.post('/manager-role', data)
		return response.data
	} catch (error) {
		throw new Error(`${error.response.data.message}`)
	}
}

export const updateUserRequest = async (id, data) => {
	try {
		const response = await userInstance.put(`/${id}`, data)
		return response.data
	} catch (error) {
		throw new Error(`${error.response.data.message}`)
	}
}

export const updateAccountRequest = async data => {
	try {
		const response = await userInstance.put('/', data)
		return response.data
	} catch (error) {
		throw new Error(`${error.response.data.message}`)
	}
}

export const updatePasswordRequest = async data => {
	try {
		const response = await userInstance.put('/password', data)
		return response.data
	} catch (error) {
		throw new Error(`${error.response.data.message}`)
	}
}

export const changeStatusUsersRequest = async (id, data) => {
	try {
		const response = await userInstance.put(`/${id}/status`, data)
		return response.data
	} catch (error) {
		throw new Error(`${error.response.data.message}`)
	}
}

export const deleteUserRequest = async id => {
	try {
		const response = await userInstance.delete(`/${id}`)
		return response.data
	} catch (error) {
		throw new Error(`${error.response.data.message}`)
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
