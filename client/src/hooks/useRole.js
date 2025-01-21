import { useEffect, useState } from 'react'
import { getAllRolesRequest, getMeRoleRequest } from '../services/api/role.api'

export const useAllRolesStore = () => {
	const [roles, setRoles] = useState(null)
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true)
			setError(null)
			try {
				const data = await getAllRolesRequest()
				setRoles(data)
			} catch (error) {
				setError(error.message)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [])

	return { roles, loading, error }
}

export const useMyRoleStore = () => {
	const [myRoles, setMyRoles] = useState(null)
	const [errorMyRoles, setErrorMyRoles] = useState(null)
	const [loadingMyRoles, setLoadingMyRoles] = useState(true)

	useEffect(() => {
		const fetchRole = async () => {
			setLoadingMyRoles(true)
			setErrorMyRoles(null)
			try {
				const data = await getMeRoleRequest()
				setMyRoles(data)
			} catch (error) {
				setErrorMyRoles(error.message)
			} finally {
				setLoadingMyRoles(false)
			}
		}

		fetchRole()
	}, [])

	return { myRoles, loadingMyRoles, errorMyRoles }
}
