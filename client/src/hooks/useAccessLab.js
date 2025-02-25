import { useCallback, useEffect, useState } from 'react'
import { AccessService } from '../services/api/accessLab.api'

export const useAccessLabStore = id => {
	const [accessData, setAccessData] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true)
				const response = await AccessService.getByIdRequest(id)
				setAccessData(response.data)
			} catch (error) {
				setError(error)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [id])

	return { accessData, loading, error }
}

export const useAccessByCodeQuoteStore = code => {
	const [accessData, setAccessData] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	const fetchData = useCallback(async () => {
		try {
			setLoading(true)
			const response = await AccessService.getByCodeRequest(code)
			setAccessData(response.data)
			setError(null)
		} catch (error) {
			setError(error)
		} finally {
			setLoading(false)
		}
	}, [code])

	useEffect(() => {
		fetchData()
	}, [fetchData])

	return { accessData, loading, error, reloadAccess: fetchData }
}

export const useAllAccessLabsStore = (limit_record = 10) => {
	const [accessLabs, setAccessLabs] = useState(null)
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

	const fetchAccessLabs = useCallback(async () => {
		setLoading(true)
		try {
			const response = await AccessService.getAllRequest(page, limit, debouncedSearch)
			setAccessLabs(response.data)
		} catch (error) {
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}, [page, limit, debouncedSearch])

	useEffect(() => {
		fetchAccessLabs()
	}, [fetchAccessLabs, page, limit])

	const accessLabData = accessLabs?.access_labs || []
	const totalRecords = accessLabs?.totalRecords || 0
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

	const handleKeyDown = e => {
		if (e.key === 'Enter') fetchAccessLabs()
	}

	return {
		accessLabs,
		loading,
		error,
		page,
		limit,
		search,
		setPage,
		setLimit,
		setSearch,
		fetchAccessLabs,
		handlePageChange,
		handleLimitChange,
		handleSearchChange,
		handleKeyDown,
		accessLabData,
		totalRecords,
		totalPages,
	}
}

export const useAllAccessPertainLabStore = (id, limit_record = 10) => {
	const [accessPertainLab, setAccessPertainLab] = useState(null)
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(true)

	const [page, setPage] = useState(1)
	const [limit, setLimit] = useState(limit_record)
	const [search, setSearch] = useState('')

	const fetchAccessPertainLab = useCallback(async () => {
		setLoading(true)
		try {
			const response = await AccessService.getAllAccessPertainLabRequest(id, page, limit, search)
			setAccessPertainLab(response)
		} catch (error) {
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}, [page, limit, search])

	useEffect(() => {
		fetchAccessPertainLab()
	}, [fetchAccessPertainLab, page, limit])

	const accessPertainLabData = accessPertainLab?.data?.access_labs || []
	const accessPertainLabMetric = accessPertainLab?.data?.metrics || []
	const totalRecords = accessPertainLab?.data?.totalRecords || 0
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
		accessPertainLab,
		loading,
		error,
		page,
		limit,
		search,
		setPage,
		setLimit,
		setSearch,
		fetchAccessPertainLab,
		handlePageChange,
		handleLimitChange,
		handleSearchChange,
		accessPertainLabData,
		accessPertainLabMetric,
		totalRecords,
		totalPages,
	}
}
