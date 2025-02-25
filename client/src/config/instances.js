import axios from 'axios'
import { ENDPOINT_API } from '../helpers/constants.helper'
import { useState } from 'react'

const createInstance = baseURL => {
	return axios.create({
		baseURL,
		withCredentials: true, // Para enviar cookies en la solicitud HTTP
	})
}

// Crear instancias de axios
export const labInstance = createInstance(ENDPOINT_API.LAB)
export const logInstance = createInstance(ENDPOINT_API.LOG)
export const authInstance = createInstance(ENDPOINT_API.AUTH)
export const userInstance = createInstance(ENDPOINT_API.USER)
export const roleInstance = createInstance(ENDPOINT_API.ROLE)
export const sampleInstance = createInstance(ENDPOINT_API.SAMPLE)
export const reportInstance = createInstance(ENDPOINT_API.REPORT)
export const kardexInstance = createInstance(ENDPOINT_API.KARDEX)
export const facultyInstance = createInstance(ENDPOINT_API.FACULTY)
export const reactiveInstance = createInstance(ENDPOINT_API.REACTIVE)
export const quotesInstance = createInstance(ENDPOINT_API.LAB_QUOTES)
export const accessLabInstance = createInstance(ENDPOINT_API.LAB_ACCESS)
export const experimentCategoryInstance = createInstance(ENDPOINT_API.EXPERIMENT_CATEGORY)
export const experimentParameterInstance = createInstance(ENDPOINT_API.EXPERIMENT_PARAMETER)
export const consumptionReactiveInstance = createInstance(ENDPOINT_API.CONSUMPTION_REACTIVE)
export const unitsMeasurementInstance = createInstance(ENDPOINT_API.REACTIVE_UNIT_MEARUREMENT)

// Manejo global de errores para token expirado
export const useAuthAxios = () => {
	const [showModal, setShowModal] = useState(false)

	// Interceptor para capturar errores de autenticación
	const interceptorsSetup = instance => {
		instance.interceptors.response.use(
			response => response, // Responder normalmente
			error => {
				if (error.response && error.response.status === 401) {
					// Si el código de estado es 401 (no autorizado), probablemente sea un token expirado
					setShowModal(true)
				}
				return Promise.reject(error)
			}
		)
	}

	// Configurar interceptores en todas las instancias
	interceptorsSetup(authInstance)
	interceptorsSetup(labInstance)
	interceptorsSetup(logInstance)
	interceptorsSetup(userInstance)
	interceptorsSetup(roleInstance)
	interceptorsSetup(sampleInstance)
	interceptorsSetup(kardexInstance)
	interceptorsSetup(facultyInstance)
	interceptorsSetup(reactiveInstance)
	interceptorsSetup(quotesInstance)
	interceptorsSetup(accessLabInstance)
	interceptorsSetup(experimentCategoryInstance)
	interceptorsSetup(experimentParameterInstance)
	interceptorsSetup(consumptionReactiveInstance)
	interceptorsSetup(unitsMeasurementInstance)

	const closeModal = () => setShowModal(false)

	return {
		showModal,
		closeModal,
	}
}
