import { useCallback, useEffect, useState } from 'react'
import { AccessService } from '../../../services/api/accessLab.api'

export const useAsignedaLabStore = id => {
	const [asignedLabData, setAsignedLabData] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	const fetchData = useCallback(async () => {
		try {
			setLoading(true)
			const response = await AccessService.getAllAsignedLabRequest(id)
			setAsignedLabData(response.data)
			setError(null)
		} catch (error) {
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}, [id])

	useEffect(() => {
		fetchData()
	}, [fetchData])

	return { loading, error, asignedLabData, fetchData }
}
