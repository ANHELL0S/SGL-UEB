import { useAllRolesStore, useMyRoleStore } from '../hooks/useRole'

export const useRoles = (rolesToCheck = []) => {
	const { myRoles, loadingMyRoles, errorMyRoles } = useMyRoleStore()
	const { roles, loading: rolesLoading, error: rolesError } = useAllRolesStore()

	const loading = loadingMyRoles || rolesLoading
	const error = errorMyRoles || rolesError

	if (loading) return { loading, error: null, userRoles: [] }
	if (error) return { loading: false, error, userRoles: [] }

	const userRoleIds = myRoles?.data?.map(role => role.id_rol) || []
	const userRoles = roles?.data?.filter(role => userRoleIds.includes(role.id_rol))

	const hasRole = rolesToCheck.some(roleType => userRoles.some(userRole => userRole.type === roleType))

	return { loading: false, error: null, hasRole, userRoles }
}
