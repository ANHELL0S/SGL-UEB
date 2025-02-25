import { useState, useCallback } from 'react'

const useCrud = () => {
	const [isVisible, setIsVisible] = useState(false)
	const openModal = useCallback(() => setIsVisible(true), [])
	const closeModal = useCallback(() => setIsVisible(false), [])
	const toggleModal = useCallback(() => setIsVisible(prev => !prev), [])

	return {
		isVisible,
		openModal,
		closeModal,
		toggleModal,
	}
}

export const useCreated = () => useCrud()
export const useUpdated = () => useCrud()
export const useBill = () => useCrud()
export const useApproved = () => useCrud()
export const usePending = () => useCrud()
export const useRejected = () => useCrud()
export const useDeleted = () => useCrud()
export const useRestored = () => useCrud()
export const useDeletedPermanent = () => useCrud()
export const useDeleteAnalys = () => useCrud()
export const useAddAnalys = () => useCrud()

// ASIGNED LAB
export const useAsignedLab = () => useCrud()

// SAMPLE
export const useCreatedSample = () => useCrud()
export const useDeletedSample = () => useCrud()
export const useUpdatedSample = () => useCrud()

// RESULT
export const useCreateResult = () => useCrud()
export const useDeletedResult = () => useCrud()
export const useUpdatedResult = () => useCrud()

// CONSUMPTION
export const useCreateConsumption = () => useCrud()
export const useDeleteConsumption = () => useCrud()

// REPORT
export const useGenerateReportSample = () => useCrud()
export const useEmited = () => useCrud()
export const useNotEmited = () => useCrud()
export const useDeletedReport = () => useCrud()
