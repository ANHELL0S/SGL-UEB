import { ROLES } from '../../helpers/constants.helper'
import { QuoteSection } from '../../features/Quote/Quote'
import { useRoles } from '../../helpers/roleControl.helper'
import { PrivateLayout } from '../../layouts/Private/PrivateLayout'
import { SpinnerLoading } from '../../components/Loaders/SpinnerLoading'

const QuotePage = () => {
	const { loading, error, userRoles } = useRoles()

	if (loading) {
		return (
			<div className='flex h-screen items-center justify-center bg-slate-50 dark:bg-gray-800'>
				<SpinnerLoading />
			</div>
		)
	}

	if (error) return <p className='text-sm text-red-500'>Error: {error}</p>

	const rolesAccepted = [ROLES.GENERAL_ADMIN, ROLES.ACCESS_MANAGER, ROLES.DIRECTOR, ROLES.SUPERVISOR]
	const roleAccept = userRoles.some(userRole => rolesAccepted.includes(userRole.type))

	return (
		<PrivateLayout hasAccess={roleAccept}>
			<QuoteSection />
		</PrivateLayout>
	)
}

export default QuotePage
