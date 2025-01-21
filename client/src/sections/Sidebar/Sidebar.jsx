import { useState } from 'react'
import { Link } from 'react-router-dom'
import { sections } from './utils/section-util'
import path_logo from '../../assets/images/logo.png'
import { SidebarItem } from './components/SidebarItem'
import { useRoles } from '../../helpers/roleControl.helper'
import { BiMenuAltLeft, BiChevronLeft } from 'react-icons/bi'
import { PATH_PRIVATE, ROLES } from '../../helpers/constants.helper'

export const Sidebar = () => {
	const [isCollapsed, setIsCollapsed] = useState(() => {
		const savedState = localStorage.getItem('sidebar-collapsed')
		return savedState !== null ? JSON.parse(savedState) : false
	})
	const [isMobileOpen, setIsMobileOpen] = useState(false)
	const toggleSidebarCollapse = () => {
		const newState = !isCollapsed
		setIsCollapsed(newState)
		localStorage.setItem('sidebar-collapsed', JSON.stringify(newState))
	}

	const { loading, error, userRoles } = useRoles([
		ROLES.DIRECTOR,
		ROLES.SUPERVISOR,
		ROLES.GENERAL_ADMIN,
		ROLES.ACCESS_MANAGER,
		ROLES.TECHNICAL_ANALYST,
	])

	if (error) return <p className='text-sm text-red-500'>Error: {error}</p>

	return (
		<>
			{/* Botón para abrir/cerrar sidebar en móvil */}
			<button
				className='fixed md:hidden bottom-4 right-4 z-10 border p-2 m-2 rounded-full transition-all duration-200 ease-in-out bg-slate-200 text-slate-600 hover:bg-slate-300 border-slate-300 dark:bg-slate-600 dark:text-slate-50 dark:hover:bg-slate-700 dark:border-slate-600'
				onClick={() => setIsMobileOpen(!isMobileOpen)}>
				<BiMenuAltLeft size={24} />
			</button>

			<nav
				className={`fixed md:static top-0 left-0 bg-slate-100 dark:bg-gray-900 z-40 h-screen transition-all ease-in-out duration-100 ${
					isMobileOpen ? 'translate-x-0 border-r dark:border-gray-700 shadow-xl' : '-translate-x-full'
				} ${isCollapsed ? 'w-16' : 'w-1/6'} md:translate-x-0 flex flex-col`}>
				{/* Header del sidebar */}
				<div className='flex items-center justify-between p-2 pt-5'>
					{!isCollapsed && (
						<Link to={PATH_PRIVATE.DASHBOARD} className='flex items-center text-slate-700 rounded-md'>
							<h1 className='text-slate-50 p-1 flex items-center justify-center'>
								<img src={path_logo} alt='Logo' className='w-20 object-cover' />
							</h1>
						</Link>
					)}

					{/* Botón para colapsar/expandir el sidebar */}
					{!isMobileOpen && (
						<button
							className={`text-slate-50 hover:bg-slate-600 bg-slate-500 rounded-full p-1 transition-all ease-in-out duration-200 ${
								isCollapsed ? '-rotate-180 ml-3' : 'rotate-0 ml-3'
							}`}
							onClick={toggleSidebarCollapse}>
							<BiChevronLeft size={24} />
						</button>
					)}
				</div>

				{/* Scrollable content */}
				<div className='flex-grow overflow-y-auto pr-3 flex items-center'>
					<div className='pl-4 flex flex-col gap-2 pt-4'>
						{sections
							.reduce((tags, section) => {
								const tagIndex = tags.findIndex(tag => tag.name === section.tag)
								if (tagIndex === -1) {
									tags.push({ name: section.tag, sections: [section] })
								} else {
									tags[tagIndex].sections.push(section)
								}
								return tags
							}, [])
							.map((tag, index) => {
								const accessibleSections = tag.sections.filter(section =>
									section.roles.some(role => userRoles.some(userRole => userRole.type === role))
								)
								return (
									accessibleSections.length > 0 && (
										<div key={index} className='space-y-2.5'>
											{!isCollapsed && (
												<p className='text-sm font-medium text-slate-400 dark:text-gray-400'>{tag.name}</p>
											)}
											{accessibleSections.map((section, idx) => (
												<SidebarItem
													key={idx}
													path={section.path}
													icon={section.icon}
													label={section.label}
													isCollapsed={isCollapsed}
													isLoading={loading}
												/>
											))}
										</div>
									)
								)
							})}
					</div>
				</div>
			</nav>
		</>
	)
}
