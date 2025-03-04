import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export const SidebarItem = ({ path, icon: Icon, label, isCollapsed, isLoading }) => {
	const location = useLocation()
	const [isHovered, setIsHovered] = useState(false)

	const isActive =
		location.pathname === path
			? 'bg-slate-500 text-slate-50 dark:bg-slate-600 dark:text-slate-50'
			: 'hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-700'

	// Esqueleto de carga
	const skeleton = (
		<div className='flex items-center gap-2 px-2 py-1.5 text-sm font-medium rounded-md w-full bg-slate-200 dark:bg-slate-700 animate-pulse'>
			<div className='w-6 h-6 bg-slate-400 dark:bg-slate-600 rounded-full'></div>
			{!isCollapsed && <div className='w-32 h-4 bg-slate-400 dark:bg-slate-600 rounded-md'></div>}
		</div>
	)

	if (isLoading) return skeleton

	return (
		<Link
			to={path}
			className={`flex items-center gap-2 p-2 text-sm font-medium ${isCollapsed ? 'rounded-lg' : 'rounded-lg'} w-full cursor-pointer transition-all ease-in-out dark:text-gray-500 text-slate-400 duration-300 ${isActive}`}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}>
			<Icon size={20} />
			{!isCollapsed && <span>{label}</span>}
			{isCollapsed && isHovered && (
				<div className='absolute dark:bg-slate-700 bg-gray-300 text-slate-500 font-semibold dark:text-slate-50 text-sm py-1 px-1.5 rounded-md ml-9'>
					{label}
				</div>
			)}
		</Link>
	)
}
