import { ROLES } from '../../helpers/constants.helper'
import { useRoles } from '../../helpers/roleControl.helper'
import { PrivateLayout } from '../../layouts/Private/PrivateLayout'
import { QuoteDetailSection } from '../../features/Quote/QuoteDetail'
import { SpinnerLoading } from '../../components/Loaders/SpinnerLoading'

const QuoteDetailPage = () => {
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
		ROLES.ACCESS_MANAGER,
		ROLES.TECHNICAL_ANALYST,
		ROLES.DIRECTOR,
		ROLES.SUPERVISOR,
	]
	const roleAccept = userRoles.some(userRole => rolesAccepted.includes(userRole.type))

	return (
		<PrivateLayout hasAccess={roleAccept}>
			<QuoteDetailSection />
		</PrivateLayout>
	)
}

export default QuoteDetailPage
