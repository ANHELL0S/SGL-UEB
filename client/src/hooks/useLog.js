import { LogService } from '../services/api/log.api'
import { useCallback, useEffect, useState } from 'react'

export const useAllLogsStore = (limit_record = 10) => {
	const [logs, setLogs] = useState(null)
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

	const fetchLogs = useCallback(async () => {
		setLoading(true)
		try {
			const data =
				limit === 'all'
					? await LogService.getAllRequest(page, undefined, debouncedSearch)
					: await LogService.getAllRequest(page, limit, debouncedSearch)
			setLogs(data)
		} catch (error) {
			setError(error.response.data)
		} finally {
			setLoading(false)
		}
	}, [page, limit, debouncedSearch])

	useEffect(() => {
		fetchLogs()
	}, [fetchLogs, page, limit])

	const logsData = logs?.data?.logs || []
	const totalRecords = logs?.data?.totalRecords || 0
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

	return {
		logs,
		loading,
		error,
		page,
		limit,
		search,
		setPage,
		setLimit,
		setSearch,
		fetchLogs,
		handlePageChange,
		handleLimitChange,
		handleSearchChange,
		logsData,
		totalRecords,
		totalPages,
	}
}
