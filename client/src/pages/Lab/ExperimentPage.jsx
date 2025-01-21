import { ROLES } from '../../helpers/constants.helper'
import { useRoles } from '../../helpers/roleControl.helper'
import { PrivateLayout } from '../../layouts/Private/PrivateLayout'
import { SpinnerLoading } from '../../components/Loaders/SpinnerLoading'
import { ExperimentSection } from '../../features/Experiment/Index'

const ExperimentPage = () => {
	const { loading, error, userRoles } = useRoles()

	if (loading) {
		return (
			<div className='flex h-screen items-center justify-center bg-slate-50 dark:bg-gray-800'>
				<SpinnerLoading />
			</div>
		)
	}

	if (error) return <p className='text-sm text-red-500'>Error: {error}</p>

	const roleAccept = userRoles.some(userRole => userRole.type === ROLES.SUPERVISOR)

	return (
		<PrivateLayout hasAccess={roleAccept}>
			<ExperimentSection />
		</PrivateLayout>
	)
}

export default ExperimentPage
