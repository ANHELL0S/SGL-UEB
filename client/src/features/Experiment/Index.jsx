import { useState } from 'react'
import { ParameterSection } from './section/Parameter'
import { CategorySection } from './section/Category'

export const ExperimentSection = () => {
	const [activeTab, setActiveTab] = useState('parameter')
	const handleTabClick = tab => setActiveTab(tab)

	return (
		<>
			<main className='w-full h-screen text-2xl dark:text-gray-200 text-slate-600 font-semibold relative flex flex-col items-start space-y-4'>
				<h1>Análisis</h1>

				<section className='flex text-sm rounded-lg p-1 dark:bg-gray-700 font-medium bg-slate-200'>
					<button
						className={`py-0.5 px-2 rounded-md transition-all ease-in-out duration-200 ${activeTab === 'parameter' ? 'dark:bg-gray-500 bg-white' : 'dark:text-gray-400 hover:dark:text-gray-300 text-slate-500 hover:text-slate-600'}`}
						onClick={() => handleTabClick('parameter')}>
						Parametros
					</button>
					<button
						className={`py-0.5 px-2 rounded-md transition-all ease-in-out duration-200 ${activeTab === 'category' ? 'dark:bg-gray-500 bg-white' : 'dark:text-gray-400 hover:dark:text-gray-300 text-slate-500 hover:text-slate-600'}`}
						onClick={() => handleTabClick('category')}>
						Categorias
					</button>
				</section>

				{activeTab === 'parameter' && <ParameterSection />}
				{activeTab === 'category' && <CategorySection />}
			</main>
		</>
	)
}
