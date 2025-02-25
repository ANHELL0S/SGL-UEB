import { ROLES } from '../../helpers/constants.helper'
import { useRoles } from '../../helpers/roleControl.helper'
import { PrivateLayout } from '../../layouts/Private/PrivateLayout'
import { SpinnerLoading } from '../../components/Loaders/SpinnerLoading'
import { DashboardSection } from '../../features/Dashboard/DashboardSection'

const DashboardPage = () => {
	const { loading, error, userRoles } = useRoles()

	if (loading) {
		return (
			<div className='flex h-screen items-center justify-center bg-slate-50 dark:bg-gray-800'>
				<SpinnerLoading />
			</div>
		)
	}

	if (error) return <p className='text-sm text-red-500'>Error: {error}</p>

	const rolesAccepted = [
		ROLES.GENERAL_ADMIN,
		ROLES.DIRECTOR,
		ROLES.SUPERVISOR,
		ROLES.TECHNICAL_ANALYST,
		ROLES.ACCESS_MANAGER,
		ROLES.GENERAL_ADMIN,
	]
	const roleAccept = userRoles.some(userRole => rolesAccepted.includes(userRole.type))

	return (
		<PrivateLayout hasAccess={roleAccept}>
			<DashboardSection />
		</PrivateLayout>
	)
}

export default DashboardPage
