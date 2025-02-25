import { useCallback, useEffect, useState } from 'react'
import { ReportService } from '../services/api/report.api'

export const useAllReportStore = (limit_record = 10) => {
	const [report, setReport] = useState(null)
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

	const fetchReport = useCallback(async () => {
		setLoading(true)
		try {
			const data =
				limit === 'all'
					? await ReportService.getAllRequest(page, undefined, debouncedSearch)
					: await ReportService.getAllRequest(page, limit, debouncedSearch)
			setReport(data)
		} catch (error) {
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}, [page, limit, debouncedSearch])

	useEffect(() => {
		fetchReport()
	}, [fetchReport, page, limit])

	const reportData = report?.data?.reports || []
	const totalRecords = report?.data?.totalRecords || 0
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
		report,
		loading,
		error,
		page,
		limit,
		search,
		setPage,
		setLimit,
		setSearch,
		fetchReport,
		handlePageChange,
		handleLimitChange,
		handleSearchChange,
		reportData,
		totalRecords,
		totalPages,
	}
}
