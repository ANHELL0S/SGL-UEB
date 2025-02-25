import { useEffect, useState, useCallback } from 'react'
import { KardexService } from '../services/api/kardex.api'

export const useAllKarexStore = (limit_record = 10) => {
	const [kardex, setKardex] = useState(null)
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

	const fetchKardex = useCallback(async () => {
		setLoading(true)
		try {
			const data =
				limit === 'all'
					? await KardexService.getAllRequest(page, undefined, debouncedSearch)
					: await KardexService.getAllRequest(page, limit, debouncedSearch)
			setKardex(data)
		} catch (error) {
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}, [page, limit, debouncedSearch])

	useEffect(() => {
		fetchKardex()
	}, [fetchKardex, page, limit])

	const kardexData = kardex?.data?.kardex || []
	const totalRecords = kardex?.data?.totalRecords || 0
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
		if (e.key === 'Enter') fetchKardex()
	}

	return {
		kardex,
		loading,
		error,
		page,
		limit,
		search,
		setPage,
		setLimit,
		setSearch,
		fetchKardex,
		handlePageChange,
		handleLimitChange,
		handleSearchChange,
		handleKeyDown,
		kardexData,
		totalRecords,
		totalPages,
	}
}

export const useLabStore = id => {
	const [data, setData] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true)
				const response = await KardexService.getByIdRequest(id)
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
