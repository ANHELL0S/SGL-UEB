import { ROLES } from '../../helpers/constants.helper'
import { useRoles } from '../../helpers/roleControl.helper'
import { PrivateLayout } from '../../layouts/Private/PrivateLayout'
import { SpinnerLoading } from '../../components/Loaders/SpinnerLoading'
import { AccessLabDetailSection } from '../../features/AccessLab/AccessLabDetail'
import { Status500 } from '../../components/Banner/StatusServer'

const AccessLabPage = () => {
	const { loading, error, userRoles } = useRoles()

	if (loading) {
		return (
			<div className='flex h-screen items-center justify-center bg-slate-50 dark:bg-gray-800'>
				<SpinnerLoading />
			</div>
		)
	}

	if (error) return <Status500 text={errorAccessLabs} />

	const rolesAccepted = [ROLES.GENERAL_ADMIN, ROLES.ACCESS_MANAGER, ROLES.DIRECTOR, ROLES.TECHNICAL_ANALYST]
	const roleAccept = userRoles.some(userRole => rolesAccepted.includes(userRole.type))

	return (
		<PrivateLayout hasAccess={roleAccept}>
			<AccessLabDetailSection />
		</PrivateLayout>
	)
}

export default AccessLabPage
