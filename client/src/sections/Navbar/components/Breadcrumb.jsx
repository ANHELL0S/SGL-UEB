import { LuChevronRight } from 'react-icons/lu'
import { BiSolidDashboard } from 'react-icons/bi'
import { useLocation, Link } from 'react-router-dom'
import { PATH_PRIVATE } from '../../../helpers/constants.helper'

export const Breadcrumb = () => {
	const location = useLocation()

	if (location.pathname === PATH_PRIVATE.DASHBOARD) return null

	const pathParts = location.pathname.split('/').filter(part => part && part !== 'inicio')

	const breadcrumbPaths = [
		{
			name: (
				<div className='dark:bg-gray-700 bg-white p-1.5 rounded-lg shadow-lg'>
					<BiSolidDashboard size={14} />
				</div>
			),
			path: PATH_PRIVATE.HOME,
		},
		...pathParts.map((part, index) => ({
			name: decodeURIComponent(part).replace(/-/g, ' '),
			path: '/' + pathParts.slice(0, index + 1).join('/'),
		})),
	]

	return (
		<nav className='flex items-center gap-1 text-xs font-semibold'>
			{breadcrumbPaths.map((crumb, index) => (
				<div key={index} className='flex items-center text-slate-600/75 dark:text-gray-300'>
					{index === breadcrumbPaths.length - 1 ? (
						<span className='break-words line-clamp-1'>{crumb.name}</span>
					) : (
						<>
							<Link
								to={crumb.path}
								className='hover:text-slate-600 dark:hover:text-gray-100 transition-all ease-in-out duration-500 break-words line-clamp-1'>
								{crumb.name}
							</Link>
							<LuChevronRight size={16} className='ml-1' />
						</>
					)}
				</div>
			))}
		</nav>
	)
}
