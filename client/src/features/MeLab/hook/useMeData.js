import { useCallback, useEffect, useState } from 'react'
import { QuoteService } from '../../../services/api/quote.api'
import { KardexService } from '../../../services/api/kardex.api'
import { AccessService } from '../../../services/api/accessLab.api'
import { ConsumptionReactiveService } from '@/services/api/consumptionReactive.api'

export const useAllAccessPertainToAnalystStore = (limit_record = 10) => {
	const [accessPertainToAnalyst, setAccessPertainToAnalyst] = useState(null)
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(true)

	const [page, setPage] = useState(1)
	const [search, setSearch] = useState('')
	const [limit, setLimit] = useState(limit_record)
	const [debouncedSearch, setDebouncedSearch] = useState(search)

	useEffect(() => {
		const handler = setTimeout(() => setDebouncedSearch(search), 500)
		return () => clearTimeout(handler)
	}, [search])

	const fetchAccessPertainToAnalyst = useCallback(async () => {
		setLoading(true)
		try {
			const data = await AccessService.getAllAccessPertainToAnalystRequest(page, limit, debouncedSearch)
			setAccessPertainToAnalyst(data)
		} catch (error) {
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}, [page, limit, debouncedSearch])

	useEffect(() => {
		fetchAccessPertainToAnalyst()
	}, [fetchAccessPertainToAnalyst, page, limit])

	const accessPertainToAnalystData = accessPertainToAnalyst?.data?.access_labs || []
	const accessPertainToAnalystMetric = accessPertainToAnalyst?.data?.metrics || []
	const totalRecords = accessPertainToAnalyst?.data?.totalRecords || 0
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
		accessPertainToAnalyst,
		loading,
		error,
		page,
		limit,
		search,
		setPage,
		setLimit,
		setSearch,
		fetchAccessPertainToAnalyst,
		handlePageChange,
		handleLimitChange,
		handleSearchChange,
		accessPertainToAnalystData,
		accessPertainToAnalystMetric,
		totalRecords,
		totalPages,
	}
}

export const useAllQuotesPertainToAnalystStore = (limit_record = 10) => {
	const [quotesPertainToAnalyst, setQuotesPertainToAnalyst] = useState(null)
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(true)

	const [page, setPage] = useState(1)
	const [search, setSearch] = useState('')
	const [limit, setLimit] = useState(limit_record)
	const [debouncedSearch, setDebouncedSearch] = useState(search)

	useEffect(() => {
		const handler = setTimeout(() => setDebouncedSearch(search), 500)
		return () => clearTimeout(handler)
	}, [search])

	const fetchQuotesPertainToAnalyst = useCallback(async () => {
		setLoading(true)
		try {
			const data = await QuoteService.getAllQuotesPertainToAnalystRequest(page, limit, debouncedSearch)
			setQuotesPertainToAnalyst(data)
		} catch (error) {
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}, [page, limit, debouncedSearch])

	useEffect(() => {
		fetchQuotesPertainToAnalyst()
	}, [fetchQuotesPertainToAnalyst, page, limit])

	const quotesPertainToAnalystData = quotesPertainToAnalyst?.data?.quotes || []
	const totalRecords = quotesPertainToAnalyst?.data?.totalRecords || 0
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
		quotesPertainToAnalyst,
		loading,
		error,
		page,
		limit,
		search,
		setPage,
		setLimit,
		setSearch,
		fetchQuotesPertainToAnalyst,
		handlePageChange,
		handleLimitChange,
		handleSearchChange,
		quotesPertainToAnalystData,
		totalRecords,
		totalPages,
	}
}

export const useAllConsumptionPertainToAnalystStore = (limit_record = 10) => {
	const [consumptionPertainToAnalyst, setConsumptionPertainToAnalyst] = useState(null)
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(true)

	const [page, setPage] = useState(1)
	const [search, setSearch] = useState('')
	const [limit, setLimit] = useState(limit_record)
	const [debouncedSearch, setDebouncedSearch] = useState(search)

	useEffect(() => {
		const handler = setTimeout(() => setDebouncedSearch(search), 500)
		return () => clearTimeout(handler)
	}, [search])

	const fetchConsumptionPertainToAnalyst = useCallback(async () => {
		setLoading(true)
		try {
			const data = await ConsumptionReactiveService.getAllConsumptionPertainToAnalystRequest(
				page,
				limit,
				debouncedSearch
			)
			setConsumptionPertainToAnalyst(data)
		} catch (error) {
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}, [page, limit, debouncedSearch])

	useEffect(() => {
		fetchConsumptionPertainToAnalyst()
	}, [fetchConsumptionPertainToAnalyst, page, limit])

	const consumptionPertainToAnalystData = consumptionPertainToAnalyst?.data?.consumption || []
	const totalRecords = consumptionPertainToAnalyst?.data?.totalRecords || 0
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
		consumptionPertainToAnalyst,
		loading,
		error,
		page,
		limit,
		search,
		setPage,
		setLimit,
		setSearch,
		fetchConsumptionPertainToAnalyst,
		handlePageChange,
		handleLimitChange,
		handleSearchChange,
		consumptionPertainToAnalystData,
		totalRecords,
		totalPages,
	}
}
