import { ROLES } from '../../helpers/constants.helper'
import { useRoles } from '../../helpers/roleControl.helper'
import { LabDetailSection } from '../../features/Lab/LabDetail'
import { PrivateLayout } from '../../layouts/Private/PrivateLayout'
import { SpinnerLoading } from '../../components/Loaders/SpinnerLoading'

const LabDetailPage = () => {
	const { loading, error, userRoles } = useRoles()

	if (loading) {
		return (
			<div className='flex h-screen items-center justify-center bg-slate-50 dark:bg-gray-800'>
				<SpinnerLoading />
			</div>
		)
	}

	if (error) return <p className='text-sm text-red-500'>Error: {error}</p>

	const rolesAccepted = [ROLES.GENERAL_ADMIN, ROLES.SUPERVISOR]
	const roleAccept = userRoles.some(userRole => rolesAccepted.includes(userRole.type))

	return (
		<PrivateLayout hasAccess={roleAccept}>
			<LabDetailSection />
		</PrivateLayout>
	)
}

export default LabDetailPage
