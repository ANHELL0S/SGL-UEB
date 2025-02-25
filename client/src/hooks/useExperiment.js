import { useCallback, useEffect, useState } from 'react'
import { ParameterService, CategoryService } from '../services/api/experiment.api'

export const useAllCategoriesStore = (limit_record = 10) => {
	const [categories, setCategories] = useState(null)
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

	const fetchCategoriesData = useCallback(async () => {
		setLoading(true)
		try {
			const data = await CategoryService.getAllRequest(page, limit, debouncedSearch)
			setCategories(data)
		} catch (error) {
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}, [page, limit, debouncedSearch])

	useEffect(() => {
		fetchCategoriesData()
	}, [fetchCategoriesData, page, limit])

	const categoriesData = categories?.data?.categories || []
	const totalRecords = categories?.data?.totalRecords || 0
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
		categories,
		loading,
		error,
		page,
		limit,
		search,
		setPage,
		setLimit,
		setSearch,
		fetchCategoriesData,
		handlePageChange,
		handleLimitChange,
		handleSearchChange,
		categoriesData,
		totalRecords,
		totalPages,
	}
}

export const useAllParametersStore = (limit_record = 10) => {
	const [experiments, setExperiments] = useState(null)
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

	const fetchExperimentsData = useCallback(async () => {
		setLoading(true)
		try {
			const data = await ParameterService.getAllRequest(page, limit, debouncedSearch)
			setExperiments(data)
		} catch (error) {
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}, [page, limit, debouncedSearch])

	useEffect(() => {
		fetchExperimentsData()
	}, [fetchExperimentsData, page, limit])

	const experimentsData = experiments?.data?.experiments || []
	const totalRecords = experiments?.data?.totalRecords || 0
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
		experiments,
		loading,
		error,
		page,
		limit,
		search,
		setPage,
		setLimit,
		setSearch,
		fetchExperimentsData,
		handlePageChange,
		handleLimitChange,
		handleSearchChange,
		experimentsData,
		totalRecords,
		totalPages,
	}
}

export const useAllExperimentToAccessStore = id => {
	const [experimentsToAcess, setExperimentsToAccess] = useState(null)
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(true)

	const fetchExperimentsToAccessData = useCallback(async () => {
		setLoading(true)
		try {
			const data = await ParameterService.getAllToAccessRequest(id)
			setExperimentsToAccess(data)
		} catch (error) {
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}, [id])

	useEffect(() => {
		fetchExperimentsToAccessData()
	}, [fetchExperimentsToAccessData])

	const totalRecords = experimentsToAcess?.data?.totalRecords || 0
	const experimentsToAcessData = experimentsToAcess?.data || []

	return {
		experimentsToAcess,
		experimentsToAcessData,
		loading,
		error,
		totalRecords,
		fetchExperimentsToAccessData,
	}
}
