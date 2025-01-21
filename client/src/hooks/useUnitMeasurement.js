import { useCallback, useEffect, useState } from 'react'
import { getAllUnitMeasurementRequest } from '../services/api/unit_measurement.api'

export const useAllUnitMeasurementStore = (limit_record = 10) => {
	const [unitMeasurement, setUnitMeasurement] = useState(null)
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

	const fetchUnitMeasurementData = useCallback(async () => {
		setLoading(true)
		try {
			const data =
				limit === 'all'
					? await getAllUnitMeasurementRequest(page, undefined, debouncedSearch)
					: await getAllUnitMeasurementRequest(page, limit, debouncedSearch)
			setUnitMeasurement(data)
		} catch (error) {
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}, [page, limit, debouncedSearch])

	useEffect(() => {
		fetchUnitMeasurementData()
	}, [fetchUnitMeasurementData, page, limit])

	const unitMeasurementData = unitMeasurement?.data?.units_measurement || []
	const totalRecords = unitMeasurement?.data?.totalRecords || 0
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
		if (e.key === 'Enter') fetchUnitMeasurementData()
	}

	return {
		unitMeasurement,
		loading,
		error,
		page,
		limit,
		search,
		setPage,
		setLimit,
		setSearch,
		fetchUnitMeasurementData,
		handlePageChange,
		handleLimitChange,
		handleSearchChange,
		unitMeasurementData,
		totalRecords,
		totalPages,
	}
}
