import { useAuth } from '../context/AuthContext'
import React, { useCallback, useEffect, useState } from 'react'
import { ToastGeneric } from '../components/Toasts/Toast'
import { UserService } from '../services/api/user.api'

export const useUserStore = () => {
	const { isAuthenticated } = useAuth()
	const [userStore, setUserStore] = React.useState([])
	const [loading, setLoading] = React.useState(false)
	const [error, setError] = React.useState(null)

	const fetchUserInfo = React.useCallback(async () => {
		if (!isAuthenticated) {
			setUserStore([])
			return
		}
		setLoading(true)
		setError(null)
		try {
			const data = await UserService.getInfoUserRequest()
			setUserStore(data)
		} catch (err) {
			setError(err)
		} finally {
			setLoading(false)
		}
	}, [isAuthenticated])

	React.useEffect(() => {
		fetchUserInfo()
	}, [fetchUserInfo])

	return { userStore, loading, error, refetch: fetchUserInfo }
}

export const useAllUsersStore = (limit_record = 10) => {
	const [users, setUsers] = useState(null)
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

	const fetchUsers = useCallback(async () => {
		setLoading(true)
		try {
			const response = await UserService.getAllRequest(page, limit, debouncedSearch)
			setUsers(response)
		} catch (error) {
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}, [page, limit, debouncedSearch])

	useEffect(() => {
		fetchUsers()
	}, [fetchUsers, page, limit])

	const usersData = users?.data?.users || []
	const totalRecords = users?.data?.totalRecords || 0
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
		if (e.key === 'Enter') fetchUsers()
	}

	return {
		users,
		loading,
		error,
		page,
		limit,
		search,
		setPage,
		setLimit,
		setSearch,
		fetchUsers,
		handlePageChange,
		handleLimitChange,
		handleSearchChange,
		handleKeyDown,
		usersData,
		totalRecords,
		totalPages,
	}
}

export const useUpdateAccount = () => {
	const updateAccount = async data => {
		try {
			const response = await UserService.updateAccountRequest(data)
			ToastGeneric({ type: 'success', message: response.message })
			return response
		} catch (error) {
			ToastGeneric({ type: 'error', message: error.message })
			throw error
		}
	}

	return { updateAccount }
}

export const useDeleteUser = () => {
	const updateAccount = async id => {
		try {
			const response = await UserService.deleteRequest(id)
			ToastGeneric({ type: 'success', message: response.message })
			return response
		} catch (error) {
			ToastGeneric({ type: 'error', message: error.message })
			throw error
		}
	}

	return { updateAccount }
}
