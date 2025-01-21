import { facultyInstance } from '../../config/instances'

export const getAllFacultiesRequest = async () => {
	try {
		const response = await facultyInstance.get('/')
		return response.data
	} catch (error) {
		throw new Error(`${error.response.data.message}`)
	}
}
