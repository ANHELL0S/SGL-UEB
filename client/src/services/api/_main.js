export class ApiService {
	constructor(instance) {
		this.instance = instance
	}

	async get(endpoint, params = {}) {
		try {
			const response = await this.instance.get(endpoint, { params })
			return response.data
		} catch (error) {
			throw new Error(error.response?.data?.message || error.message)
		}
	}

	async getById(endpoint, id) {
		return this.get(`${endpoint}/${id}`)
	}

	async post(endpoint, data) {
		try {
			const response = await this.instance.post(endpoint, data)
			return response.data
		} catch (error) {
			throw new Error(error.response?.data?.message || error.message)
		}
	}

	async put(endpoint, data) {
		try {
			const response = await this.instance.put(endpoint, data)
			return response.data
		} catch (error) {
			throw new Error(error.response?.data?.message || error.message)
		}
	}

	async delete(endpoint) {
		try {
			const response = await this.instance.delete(endpoint)
			return response.data
		} catch (error) {
			throw new Error(error.response?.data?.message || error.message)
		}
	}
}
