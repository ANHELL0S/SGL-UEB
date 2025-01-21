import { useCallback, useEffect, useState } from 'react'
import { getAllFacultiesRequest } from '../services/api/faculty.api'

export const useAllFacultiesStore = () => {
	const [faculties, setFaculties] = useState([])
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(true)

	const fetchFacultiesData = useCallback(async () => {
		setLoading(true)
		setError(null)
		try {
			const response = await getAllFacultiesRequest()
			setFaculties(response.data.faculties)
		} catch (err) {
			setError(err.message)
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchFacultiesData()
	}, [fetchFacultiesData])

	return {
		faculties,
		loading,
		error,
		fetchFacultiesData,
	}
}
