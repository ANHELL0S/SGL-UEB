import { useEffect, useState, useCallback } from 'react'
import { LabService } from '../services/api/lab.api'

export const useAllLabsStore = (limit_record = 10) => {
	const [labs, setLabs] = useState(null)
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

	const fetchLabs = useCallback(async () => {
		setLoading(true)
		try {
			const data =
				limit === 'all'
					? await LabService.getAllRequest(page, undefined, debouncedSearch)
					: await LabService.getAllRequest(page, limit, debouncedSearch)
			setLabs(data)
		} catch (error) {
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}, [page, limit, debouncedSearch])

	useEffect(() => {
		fetchLabs()
	}, [fetchLabs, page, limit])

	const labData = labs?.data?.labs || []
	const totalRecords = labs?.data?.totalRecords || 0
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
		if (e.key === 'Enter') fetchLabs()
	}

	return {
		labs,
		loading,
		error,
		page,
		limit,
		search,
		setPage,
		setLimit,
		setSearch,
		fetchLabs,
		handlePageChange,
		handleLimitChange,
		handleSearchChange,
		handleKeyDown,
		labData,
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
				const response = await LabService.getByIdRequest(id)
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

export const useFindLabToNameStore = name => {
	const [lab, setLab] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true)
				const response = await LabService.findLabToNameRequest(name)
				setLab(response)
			} catch (error) {
				setError(error)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [name])

	return { lab, loading, error }
}
