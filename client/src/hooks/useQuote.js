import { useEffect, useState, useCallback } from 'react'
import { QuoteService } from '../services/api/quote.api'

export const useAllQuotesStore = (limit_record = 10) => {
	const [quotes, setQuotes] = useState(null)
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

	const fetchQuotes = useCallback(async () => {
		setLoading(true)
		try {
			const data =
				limit === 'all'
					? await QuoteService.getAllRequest(page, undefined, debouncedSearch)
					: await QuoteService.getAllRequest(page, limit, debouncedSearch)
			setQuotes(data)
		} catch (error) {
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}, [page, limit, debouncedSearch])

	useEffect(() => {
		fetchQuotes()
	}, [fetchQuotes, page, limit])

	const quotesData = quotes?.data?.quotes || []
	const totalRecords = quotes?.data?.totalRecords || 0
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
		if (e.key === 'Enter') fetchQuotes()
	}

	return {
		quotes,
		loading,
		error,
		page,
		limit,
		search,
		setPage,
		setLimit,
		setSearch,
		fetchQuotes,
		handlePageChange,
		handleLimitChange,
		handleSearchChange,
		handleKeyDown,
		quotesData,
		totalRecords,
		totalPages,
	}
}

export const useQuoteStore = id => {
	const [quoteData, setQuoteData] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true)
				const response = await QuoteService.getByIdRequest(id)
				setQuoteData(response.data)
			} catch (error) {
				setError(error.message)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [id])

	return { quoteData, loading, error }
}

export const useQuoteByCodeStore = code => {
	const [quoteData, setQuoteData] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	const [reload, setReload] = useState(false)

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true)
				const response = await QuoteService.getByCodeRequest(code)
				setQuoteData(response.data)
			} catch (error) {
				setError(error)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [code, reload])

	const fetchQuoteData = () => setReload(prev => !prev)

	return { quoteData, loading, error, fetchQuoteData }
}

export const useLabStore = id => {
	const [data, setData] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true)
				const response = await QuoteService.getByIdRequest(id)
				setData(response.data)
			} catch (error) {
				setError(error.message)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [id])

	return { data, loading, error }
}
