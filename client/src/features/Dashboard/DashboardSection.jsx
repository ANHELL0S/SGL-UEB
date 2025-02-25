import { useUserStore } from '../../hooks/useUser'
import { QuoteCard } from './components/QuoteCard'
import { WidgetCard } from './components/WidgetCard'
import { ReportCard } from './components/ReportCard'
import { useAllLabsStore } from '../../hooks/useLab'
import { useAllUsersStore } from '../../hooks/useUser'
import { useAllQuotesStore } from '../../hooks/useQuote'
import { useAllReportStore } from '../../hooks/useReport'
import { useAllSamplesStore } from '../../hooks/useSample'
import { useAllReactivesStore } from '../../hooks/useReactive'
import { useAllAccessLabsStore } from '../../hooks/useAccessLab'
import { BiSolidAnalyse, BiSolidCollection, BiSolidDollarCircle, BiSolidFoodMenu, BiSolidShapes } from 'react-icons/bi'

const DashboardSection = () => {
	const { userStore, loading, error } = useUserStore()
	const { users, loading: loadingUsers } = useAllUsersStore()
	const { labs, loading: loadingLabs } = useAllLabsStore()
	const { reactives, loading: loadingReactives } = useAllReactivesStore()
	const { quotes, loading: loadingQuotes } = useAllQuotesStore(3)
	const { report, loading: loadingReports } = useAllReportStore(3)
	const { accessLabs, loading: loadingAccess } = useAllAccessLabsStore()
	const { samples, loading: loadingSamples } = useAllSamplesStore()

	return (
		<main className='space-y-6'>
			{/* Hero Section */}
			<section className='relative bg-gradient-to-r from-gray-700 to-cyan-700 text-slate-50 py-6 rounded-lg'>
				<div className='container mx-auto px-4'>
					<h1 className='text-4xl font-bold mb-2'>Hola, {userStore?.data?.names} 👋🏻</h1>
					<p className='text-base text-slate-100'>Gestiona tu laboratorio, desde cotizaciones o acceso, todo en uno.</p>
				</div>
			</section>

			{/* Información general */}
			<section className='space-y-4'>
				<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
					<WidgetCard
						icon={BiSolidCollection}
						title='Laboratorios'
						value={labs?.data?.totalRecords || 0}
						color='bg-yellow-200/80 dark:bg-yellow-200'
						loading={loadingLabs}
					/>
					<WidgetCard
						icon={BiSolidAnalyse}
						title='Muestras'
						value={samples?.data?.totalRecords || 0}
						color='bg-cyan-200/85 dark:bg-cyan-200'
						loading={loadingSamples}
					/>
					<WidgetCard
						icon={BiSolidShapes}
						title='Reactivos'
						value={reactives?.data?.totalRecords || 0}
						color='bg-purple-200/85 dark:bg-purple-200'
						loading={loadingReactives}
					/>
					<WidgetCard
						icon={BiSolidFoodMenu}
						title='Accesos'
						value={accessLabs?.totalRecords || 0}
						color='bg-lime-200/80 dark:bg-lime-200'
						loading={loadingAccess}
					/>
					<WidgetCard
						icon={BiSolidDollarCircle}
						title='Cotizaciones'
						value={quotes?.data?.totalRecords || 0}
						color='bg-pink-200/80 dark:bg-pink-200'
						loading={loadingQuotes}
					/>
				</div>
			</section>

			{/* Cotizaciones recientes y Estadísticas */}
			<section className='grid grid-cols-1 md:grid-cols-2 gap-8'>
				<div className='space-y-4'>
					<h3 className='text-xl font-medium text-slate-600 dark:text-gray-300'>Cotizaciones recientes</h3>
					<div className='space-y-4'>
						<QuoteCard quotesData={quotes} loading={loadingQuotes} />
					</div>
				</div>

				<div className='space-y-4'>
					<h3 className='text-xl font-medium text-slate-600 dark:text-gray-300'>Reportes recientes</h3>
					<div className='space-y-4'>
						<ReportCard reportData={report} loading={loadingReports} />
					</div>
				</div>
			</section>
		</main>
	)
}

export { DashboardSection }
