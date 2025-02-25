import { useCallback, useEffect, useState } from 'react'
import { SampleService } from '../services/api/sample.api'

export const useAllSamplesStore = (limit_record = 10) => {
	const [samples, setSamples] = useState(null)
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

	const fetchSamples = useCallback(async () => {
		setLoading(true)
		try {
			const data =
				limit === 'all'
					? await SampleService.getAllRequest(page, undefined, debouncedSearch)
					: await SampleService.getAllRequest(page, limit, debouncedSearch)
			setSamples(data)
		} catch (error) {
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}, [page, limit, debouncedSearch])

	useEffect(() => {
		fetchSamples()
	}, [fetchSamples, page, limit])

	const samplesData = samples?.data?.samples || []
	const totalRecords = samples?.data?.totalRecords || 0
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
		samples,
		loading,
		error,
		page,
		limit,
		search,
		setPage,
		setLimit,
		setSearch,
		fetchSamples,
		handlePageChange,
		handleLimitChange,
		handleSearchChange,
		samplesData,
		totalRecords,
		totalPages,
	}
}

export const useAllSamplesPertainToAccessStore = (id, limit_record = 10) => {
	const [samples, setSamples] = useState(null)
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

	const fetchSamples = useCallback(async () => {
		setLoading(true)
		try {
			const data =
				limit === 'all'
					? await SampleService.getAllToAccessRequest(id, page, undefined, debouncedSearch)
					: await SampleService.getAllToAccessRequest(id, page, limit, debouncedSearch)
			setSamples(data)
		} catch (error) {
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}, [page, limit, debouncedSearch])

	useEffect(() => {
		fetchSamples()
	}, [fetchSamples, page, limit])

	const samplesData = samples?.data?.samples || []
	const totalRecords = samples?.data?.totalRecords || 0
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
		samples,
		loading,
		error,
		page,
		limit,
		search,
		setPage,
		setLimit,
		setSearch,
		fetchSamples,
		handlePageChange,
		handleLimitChange,
		handleSearchChange,
		samplesData,
		totalRecords,
		totalPages,
	}
}
