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
export const useAssignRole = () => useCrud()
export const useActived = () => useCrud()
export const useDesactived = () => useCrud()
export const useDelete = () => useCrud()
export const useRestored = () => useCrud()
export const useDeletePermanent = () => useCrud()
