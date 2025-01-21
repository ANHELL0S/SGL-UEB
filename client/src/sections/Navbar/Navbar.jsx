import Avvvatars from 'avvvatars-react'
import { useUserStore } from '../../hooks/useUser'
import { useAuth } from '../../context/AuthContext'
import { Link, useLocation } from 'react-router-dom'
import ThemeContext from '../../context/ThemeContext'
import { useContext, useState, useEffect } from 'react'
import { PATH_PRIVATE } from '../../helpers/constants.helper'
import { LuMoonStar, LuSun, LuMonitor, LuArrowDown, LuChevronDown } from 'react-icons/lu'
import { Breadcrumb } from './components/Breadcrumb'

const Navbar = () => {
	const { logout } = useAuth()
	const location = useLocation()
	const { userStore } = useUserStore()
	const { theme, toggleTheme } = useContext(ThemeContext)
	const [menuOpen, setMenuOpen] = useState(false)
	const [dropdownOpen, setDropdownOpen] = useState(false)

	const pathParts = location.pathname.split('/').filter(part => part)

	const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

	useEffect(() => {
		if (theme === 'system') toggleTheme(systemTheme)
	}, [theme, systemTheme, toggleTheme])

	const handleThemeChange = newTheme => {
		toggleTheme(newTheme)
		setMenuOpen(false)
	}

	const handleLogout = () => {
		logout()
		setDropdownOpen(false)
	}

	return (
		<nav className='flex items-center justify-between pb-4 text-slate-600 dark:text-gray-100'>
			<section className='mt-2 text-sm'>
				<div aria-label='breadcrumb'>
					<div className='flex items-center gap-0 font-semibold text-lg'>
						<Breadcrumb />
					</div>
				</div>
			</section>

			<section className='flex items-center gap-4 text-sm font-semibold relative'>
				<button
					onClick={() => {
						toggleTheme(theme === 'dark' ? 'light' : 'dark')
					}}
					className='p-2 ml-4 dark:hover:bg-slate-700 hover:bg-slate-200 rounded-full transition-all duration-500 ease-in-out swap'>
					<div className={`${theme === 'dark' ? '-rotate-45' : ''}`}>
						{theme === 'dark' ? (
							<LuSun className='text-lg transform transition-transform duration-500 ease-in-out' />
						) : (
							<LuMoonStar className='text-lg transform transition-transform duration-500 ease-in-out' />
						)}
					</div>
				</button>

				<div className='relative'>
					<button
						onClick={() => setDropdownOpen(!dropdownOpen)}
						className='flex items-center gap-2 w-full dark:hover:bg-gray-700 hover:bg-slate-200 transition-all ease-linear duration-500 rounded-2xl'>
						<Avvvatars size={32} value={userStore?.data?.names} />
						<div className='flex items-center gap-2 mr-2'>
							<span className='hidden md:flex'>{userStore?.data?.names}</span>
							<LuChevronDown
								className={`transform transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : 'rotate-0'}`}
							/>
						</div>
					</button>

					{dropdownOpen && (
						<div className='absolute right-0 top-12 z-50 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg w-36 p-1 transform transition-all duration-300 ease-in-out'>
							<Link
								to={PATH_PRIVATE.ACCOUNT}
								onClick={() => setDropdownOpen(false)}
								className='block px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md'>
								Perfil
							</Link>
							<button
								onClick={handleLogout}
								className='w-full text-left px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md'>
								Cerrar sesión
							</button>
						</div>
					)}
				</div>
			</section>
		</nav>
	)
}

export { Navbar }
