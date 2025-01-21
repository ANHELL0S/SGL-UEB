import axios from 'axios'

import { ENDPOINT_API } from '../helpers/constants.helper'

const createInstance = baseURL => {
	return axios.create({
		baseURL,
		withCredentials: true,
	})
}

export const labInstance = createInstance(ENDPOINT_API.LAB)
export const authInstance = createInstance(ENDPOINT_API.AUTH)
export const userInstance = createInstance(ENDPOINT_API.USER)
export const roleInstance = createInstance(ENDPOINT_API.ROLE)
export const sampleInstance = createInstance(ENDPOINT_API.SAMPLE)
export const reactiveInstance = createInstance(ENDPOINT_API.REACTIVE)
export const unitsMeasurementInstance = createInstance(ENDPOINT_API.REACTIVE_UNIT_MEARUREMENT)
export const accessLabInstance = createInstance(ENDPOINT_API.LAB_ACCESS)
export const experimentInstance = createInstance(ENDPOINT_API.LAB_EXPERIMENT)
export const quotesInstance = createInstance(ENDPOINT_API.LAB_QUOTES)
export const facultyInstance = createInstance(ENDPOINT_API.FACULTY)
