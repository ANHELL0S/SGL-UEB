import { NotFoundSection } from '../../features/404/404'
import { PublicLayout } from '../../layouts/Public/PublicLayout'
import { PrivateLayout } from '../../layouts/Private/PrivateLayout'

const NotFoundPage = () => {
	const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'

	return (
		<>
			{isAuthenticated ? (
				<PrivateLayout>
					<NotFoundSection />
				</PrivateLayout>
			) : (
				<PublicLayout>
					<NotFoundSection />
				</PublicLayout>
			)}
		</>
	)
}

export default NotFoundPage
