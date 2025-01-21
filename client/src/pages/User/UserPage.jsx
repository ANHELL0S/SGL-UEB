import { SpinnerLoading } from '../../components/Loaders/SpinnerLoading'
import { UserSection } from '../../features/User/User'
import { ROLES } from '../../helpers/constants.helper'
import { useRoles } from '../../helpers/roleControl.helper'
import { PrivateLayout } from '../../layouts/Private/PrivateLayout'

const UserPage = () => {
	const { loading, error, userRoles } = useRoles()

	if (loading) {
		return (
			<div className='flex h-screen items-center justify-center bg-slate-50 dark:bg-gray-800'>
				<SpinnerLoading />
			</div>
		)
	}

	if (error) return <p className='text-sm text-red-500'>Error: {error}</p>

	const roleAccept = userRoles.some(userRole => userRole.type === ROLES.GENERAL_ADMIN)

	return (
		<PrivateLayout hasAccess={roleAccept}>
			<UserSection />
		</PrivateLayout>
	)
}

export default UserPage
