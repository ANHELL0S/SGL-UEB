import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PATH_AUTH, PATH_PRIVATE } from '../helpers/constants.helper'

export function RedirectIfAuthenticated({ children }) {
	const { isAuthenticated, loading } = useAuth()
	if (loading) return null
	if (isAuthenticated) return <Navigate to={PATH_PRIVATE.DASHBOARD} replace />
	return children
}

export function RedirectIfNotAuthenticated({ children }) {
	const { isAuthenticated, loading } = useAuth()
	if (loading) return null
	if (!isAuthenticated) return <Navigate to={PATH_AUTH.LOGIN} replace />
	return children
}
