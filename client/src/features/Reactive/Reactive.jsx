import { useState } from 'react'
import { StockReactiveSection } from './section/Stock'
import { KardexSection } from './section/Kardex'

export const ReactiveSection = () => {
	const [activeTab, setActiveTab] = useState('reactive')
	const handleTabClick = tab => setActiveTab(tab)

	return (
		<>
			<main className='w-full h-screen text-2xl dark:text-gray-200 text-slate-600 font-semibold relative flex flex-col items-start space-y-4'>
				<h1>Inventario</h1>

				<section className='flex text-sm rounded-lg p-1 dark:bg-gray-700 font-medium bg-slate-200'>
					<button
						className={`py-0.5 px-2 rounded-md transition-all ease-in-out duration-200 ${activeTab === 'reactive' ? 'dark:bg-gray-500 bg-white' : 'dark:text-gray-400 hover:dark:text-gray-300 text-slate-500 hover:text-slate-600'}`}
						onClick={() => handleTabClick('reactive')}>
						Reactivos
					</button>
					<button
						className={`py-0.5 px-2 rounded-md transition-all ease-in-out duration-200 ${activeTab === 'kardex' ? 'dark:bg-gray-500 bg-white' : 'dark:text-gray-400 hover:dark:text-gray-300 text-slate-500 hover:text-slate-600'}`}
						onClick={() => handleTabClick('kardex')}>
						Kardex
					</button>
				</section>

				{activeTab === 'reactive' && <StockReactiveSection />}
				{activeTab === 'kardex' && <KardexSection />}
			</main>
		</>
	)
}
