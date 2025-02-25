import { useCallback, useEffect, useState } from 'react'
import { ConsumptionReactiveService } from '../services/api/consumptionReactive.api'

export const useAllSamplesStore = (limit_record = 10) => {
	const [consumption, setConsumption] = useState(null)
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

	const fetchConsumption = useCallback(async () => {
		setLoading(true)
		try {
			const data =
				limit === 'all'
					? await ConsumptionReactiveService.getAllRequest(page, undefined, debouncedSearch)
					: await ConsumptionReactiveService.getAllRequest(page, limit, debouncedSearch)
			setConsumption(data)
		} catch (error) {
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}, [page, limit, debouncedSearch])

	useEffect(() => {
		fetchConsumption()
	}, [fetchConsumption, page, limit])

	const consumptionData = consumption?.data?.consumption || []
	const totalRecords = consumption?.data?.totalRecords || 0
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
		consumption,
		loading,
		error,
		page,
		limit,
		search,
		setPage,
		setLimit,
		setSearch,
		fetchConsumption,
		handlePageChange,
		handleLimitChange,
		handleSearchChange,
		consumptionData,
		totalRecords,
		totalPages,
	}
}

export const useAllConsumptionPertainToAccessStore = (id, limit_record = 10) => {
	const [consumption, setConsumption] = useState(null)
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

	const fetchConsumption = useCallback(async () => {
		setLoading(true)
		try {
			const data =
				limit === 'all'
					? await ConsumptionReactiveService.getAllToAccessRequest(id, page, undefined, debouncedSearch)
					: await ConsumptionReactiveService.getAllToAccessRequest(id, page, limit, debouncedSearch)
			setConsumption(data)
		} catch (error) {
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}, [page, limit, debouncedSearch])

	useEffect(() => {
		fetchConsumption()
	}, [fetchConsumption, page, limit])

	const consumptionData = consumption?.data?.consumption || []
	const totalRecords = consumption?.data?.totalRecords || 0
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
		consumption,
		loading,
		error,
		page,
		limit,
		search,
		setPage,
		setLimit,
		setSearch,
		fetchConsumption,
		handlePageChange,
		handleLimitChange,
		handleSearchChange,
		consumptionData,
		totalRecords,
		totalPages,
	}
}
