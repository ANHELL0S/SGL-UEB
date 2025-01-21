import { useCallback, useEffect, useState } from 'react'
import { getAllReactivesRequest } from '../services/api/reactive.api'

export const useAllReactivesStore = (limit_record = 10) => {
	const [reactives, setReactives] = useState(null)
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(true)

	const [page, setPage] = useState(1)
	const [limit, setLimit] = useState(limit_record)
	const [search, setSearch] = useState('')
	const [debouncedSearch, setDebouncedSearch] = useState(search)

	useEffect(() => {
		const handler = setTimeout(() => setDebouncedSearch(search), 500)
		return () => clearTimeout(handler)
	}, [search])

	const fetchReactives = useCallback(async () => {
		setLoading(true)
		try {
			const data =
				limit === 'all'
					? await getAllReactivesRequest(page, undefined, debouncedSearch)
					: await getAllReactivesRequest(page, limit, debouncedSearch)
			setReactives(data)
		} catch (error) {
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}, [page, limit, debouncedSearch])

	useEffect(() => {
		fetchReactives()
	}, [fetchReactives, page, limit])

	const reactivesData = reactives?.data?.reactives || []
	const totalRecords = reactives?.data?.totalRecords || 0
	const totalPages = limit === 'all' ? 1 : Math.ceil(totalRecords / limit)

	useEffect(() => {
		if (page > totalPages) setPage(1)
	}, [page, totalPages])

	const handlePageChange = newPage => {
		if (newPage >= 1 && newPage <= totalPages) setPage(newPage)
	}

	const handleLimitChange = e => {
		const newLimit = e.target.value === 'all' ? 'all' : parseInt(e.target.value, 10)
		setLimit(newLimit)
	}

	const handleSearchChange = e => setSearch(e.target.value)

	const handleKeyDown = e => {
		if (e.key === 'Enter') fetchReactives()
	}

	return {
		reactives,
		loading,
		error,
		page,
		limit,
		search,
		setPage,
		setLimit,
		setSearch,
		fetchReactives,
		handlePageChange,
		handleLimitChange,
		handleSearchChange,
		handleKeyDown,
		reactivesData,
		totalRecords,
		totalPages,
	}
}
