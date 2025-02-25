import { Navbar } from '../../sections/Navbar/Navbar'
import { Footer } from '../../sections/Footer/Footer'
import { Sidebar } from '../../sections/Sidebar/Sidebar'
import { Unauthorized } from '../../components/Banner/Unauthorized'

export const PrivateLayout = ({ children, hasAccess }) => {
	return (
		<div className='flex bg-slate-100 dark:bg-gray-900 h-screen flex-col lg:flex-row md:flex-row sm:flex-row'>
			<Sidebar />
			<div className='flex-1 mx-2 m-4 pr-2D flex flex-col overflow-auto'>
				<Navbar />
				<div className='overflow-auto dark:bg-gray-800 shadow-lg bg-white p-5 rounded-xl h-screen border dark:border-gray-700'>
					{hasAccess === false ? <Unauthorized /> : children}
				</div>
				<Footer />
			</div>
		</div>
	)
}
