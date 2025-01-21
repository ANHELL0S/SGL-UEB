import { useCallback, useEffect, useState } from 'react'
import { getAllExperimentsRequest } from '../services/api/experiment.api'

export const useAllExperimentsStore = (limit_record = 10) => {
	const [experiments, setExperiments] = useState(null)
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(true)

	const [page, setPage] = useState(1)
	const [limit, setLimit] = useState(limit_record)
	const [search, setSearch] = useState('')

	const fetchExperimentsData = useCallback(async () => {
		setLoading(true)
		try {
			const data = await getAllExperimentsRequest(page, limit, search)
			setExperiments(data)
		} catch (error) {
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}, [page, limit, search])

	useEffect(() => {
		fetchExperimentsData()
	}, [fetchExperimentsData, page, limit])

	const experimentsData = experiments?.data?.experiments || []
	const totalRecords = experiments?.data?.totalRecords || 0
	const totalPages = Math.ceil(totalRecords / limit)

	useEffect(() => {
		if (page > totalPages) setPage(1)
	}, [page, totalPages])

	const handlePageChange = newPage => {
		if (newPage >= 1 && newPage <= totalPages) setPage(newPage)
	}

	const handleLimitChange = e => {
		const newLimit = parseInt(e.target.value, 10)
		setLimit(newLimit)
	}

	const handleSearchChange = e => setSearch(e.target.value)

	return {
		experiments,
		loading,
		error,
		page,
		limit,
		search,
		setPage,
		setLimit,
		setSearch,
		fetchExperimentsData,
		handlePageChange,
		handleLimitChange,
		handleSearchChange,
		experimentsData,
		totalRecords,
		totalPages,
	}
}
