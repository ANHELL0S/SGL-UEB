import { useState } from 'react'
import { QuoteSection } from './section/Quotes'
import { AccessSection } from './section/Access'
import { ConsumptionSection } from './section/Consumption'

export const LabMeSection = () => {
	const [activeTab, setActiveTab] = useState('accesos')
	const handleTabClick = tab => setActiveTab(tab)

	return (
		<>
			<main className='w-full h-screen text-2xl dark:text-gray-200 text-slate-600 font-semibold relative flex flex-col items-start space-y-4'>
				<h1>Mi laboratorio</h1>

				<section className='flex text-sm rounded-lg p-1 bg-slate-200 dark:bg-gray-700 font-medium'>
					<button
						className={`py-0.5 px-2 rounded-md transition-all ease-in-out duration-200 ${activeTab === 'accesos' ? 'dark:bg-gray-500 bg-slate-50' : 'dark:text-gray-400 hover:dark:text-gray-300 hover:text-gray-600 text-slate-500'}`}
						onClick={() => handleTabClick('accesos')}>
						Investigaciones
					</button>
					<button
						className={`py-0.5 px-2 rounded-md transition-all ease-in-out duration-200 ${activeTab === 'quotes' ? 'dark:bg-gray-500 bg-slate-50' : 'dark:text-gray-400 hover:dark:text-gray-300 hover:text-gray-600 text-slate-500'}`}
						onClick={() => handleTabClick('quotes')}>
						Servicios
					</button>
					<button
						className={`py-0.5 px-2 rounded-md transition-all ease-in-out duration-200 ${activeTab === 'consumption' ? 'dark:bg-gray-500 bg-slate-50' : 'dark:text-gray-400 hover:dark:text-gray-300 hover:text-gray-600 text-slate-500'}`}
						onClick={() => handleTabClick('consumption')}>
						Consumos
					</button>
				</section>

				<section className='w-full h-screen text-2xl dark:text-gray-200 text-slate-600 font-semibold relative flex flex-col items-start space-y-4'>
					{activeTab === 'accesos' && <AccessSection />}
					{activeTab === 'quotes' && <QuoteSection />}
					{activeTab === 'consumption' && <ConsumptionSection />}
				</section>
			</main>
		</>
	)
}
