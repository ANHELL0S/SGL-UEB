import { LabMeSection } from '../../features/MeLab/LabMe'
import { ROLES } from '../../helpers/constants.helper'
import { useRoles } from '../../helpers/roleControl.helper'
import { PrivateLayout } from '../../layouts/Private/PrivateLayout'
import { SpinnerLoading } from '../../components/Loaders/SpinnerLoading'

const LabMePage = () => {
	const { loading, error, userRoles } = useRoles()

	if (loading) {
		return (
			<div className='flex h-screen items-center justify-center bg-slate-50 dark:bg-gray-800'>
				<SpinnerLoading />
			</div>
		)
	}

	if (error) return <p className='text-sm text-red-500'>Error: {error}</p>

	const roleAccept = userRoles.some(userRole => userRole.type === ROLES.TECHNICAL_ANALYST)

	return (
		<PrivateLayout hasAccess={roleAccept}>
			<LabMeSection />
		</PrivateLayout>
	)
}

export default LabMePage
