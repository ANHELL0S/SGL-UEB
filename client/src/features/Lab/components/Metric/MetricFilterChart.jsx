import { useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export const MetricsFilterChart = ({ accessPertainLabMetric }) => {
	const { totalByDay = {}, totalByMonth = {}, totalByYear = {}, totalByWeek = {} } = accessPertainLabMetric || {}

	const prepareChartData = timeFrameData => {
		const labels = Object.keys(timeFrameData)

		const statusApproved = labels.map(date => timeFrameData[date].status?.approved || 0)
		const statusPending = labels.map(date => timeFrameData[date].status?.pending || 0)
		const statusRejected = labels.map(date => timeFrameData[date].status?.rejected || 0)
		const accessInternal = labels.map(date => timeFrameData[date].typeAccess?.access_internal || 0)
		const accessPublic = labels.map(date => timeFrameData[date].typeAccess?.access_public || 0)

		return {
			labels,
			datasets: [
				{
					label: 'Aprobados',
					data: statusApproved,
					backgroundColor: 'rgba(110, 231, 183, 0.6)',
					borderColor: '#18564e',
					borderWidth: 0,
				},
				{
					label: 'Pendientes',
					data: statusPending,
					backgroundColor: 'rgba(253, 186, 116, 0.6)',
					borderColor: '#674b26',
					borderWidth: 0,
				},
				{
					label: 'Rechazados',
					data: statusRejected,
					backgroundColor: 'rgba(252, 165, 165, 0.6)',
					borderColor: '#732830',
					borderWidth: 0,
				},
				{
					label: 'Accesos',
					data: accessInternal,
					backgroundColor: 'rgba(42, 67, 119, 0.6)',
					borderColor: '#2a4377',
					borderWidth: 0,
				},
			],
		}
	}

	const chartOptions = {
		responsive: true,
		plugins: {
			legend: {
				display: false,
				position: 'bottom',
				labels: {
					font: {
						size: 12,
						weight: 'bold',
					},
					color: 'rgba(96, 114, 136)',
					padding: 16,
				},
				boxWidth: 20,
				boxHeight: 10,
				usePointStyle: true,
			},
			tooltip: {
				callbacks: {
					label: function (tooltipItem) {
						return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`
					},
				},
				backgroundColor: 'rgba(31, 41, 55, 0.9)',
				titleColor: 'rgba(255, 255, 255, 0.8)',
				bodyColor: 'rgba(255, 255, 255, 0.9)',
				borderColor: 'rgba(255, 255, 255, 0.2)',
				borderWidth: 1,
				caretSize: 6,
				cornerRadius: 8,
				displayColors: false,
			},
		},
		scales: {
			x: {
				title: {
					display: false,
					text: 'Tiempo',
				},
			},
			y: {
				title: {
					display: false,
					text: 'Accesos',
				},
				beginAtZero: true,
			},
		},
	}

	// Prepare chart data for each time frame
	const dayChartData = prepareChartData(totalByDay)
	const weekChartData = prepareChartData(totalByWeek)
	const monthChartData = prepareChartData(totalByMonth)
	const yearChartData = prepareChartData(totalByYear)

	// Active tab for chart rendering
	const [activeTab, setActiveTab] = useState('day')

	// Render the selected chart
	const renderChart = () => {
		switch (activeTab) {
			case 'day':
				return <Bar data={dayChartData} options={chartOptions} />
			case 'week':
				return <Bar data={weekChartData} options={chartOptions} />
			case 'month':
				return <Bar data={monthChartData} options={chartOptions} />
			case 'year':
				return <Bar data={yearChartData} options={chartOptions} />
			default:
				return <Bar data={dayChartData} options={chartOptions} />
		}
	}

	// Función para obtener el total de accesos según la pestaña activa
	const getTotalAccesses = () => {
		const data =
			{
				day: totalByDay,
				week: totalByWeek,
				month: totalByMonth,
				year: totalByYear,
			}[activeTab] || {}

		return Object.values(data).reduce((sum, entry) => sum + (entry.total || 0), 0)
	}

	// Función para obtener el título con el total de accesos
	const getTitleTab = () => {
		const titles = {
			day: 'hoy',
			week: 'semanal',
			month: 'mensual',
			year: 'anual',
		}
		return `${titles[activeTab]} (${getTotalAccesses()})`
	}

	const translateTab = tab => {
		const translations = {
			day: 'Hoy',
			week: 'Semanal',
			month: 'Mensual',
			year: 'Anual',
		}
		return translations[tab] || tab
	}

	return (
		<div className='space-y-3'>
			{/* Title and chart */}
			<div className='space-y-4'>
				<div className='w-auto h-auto rounded-xl dark:bg-gray-900/50 p-4 space-y-4'>
					<div className='md:flex items-center justify-between space-y-2'>
						<h2 className='text-lg font-medium text-slate-600 dark:text-neutral-300'>Accesos {getTitleTab()}</h2>
						<div className='inline-flex space-x-2 rounded-lg p-1 bg-slate-200 dark:bg-gray-800 dark:text-gray-400 text-slate-500 text-xs font-medium'>
							{['day', 'week', 'month', 'year'].map(tab => (
								<button
									key={tab}
									className={`px-2 py-1 rounded-md ${activeTab === tab ? 'bg-slate-50 text-slate-600 dark:text-gray-300 dark:bg-gray-700' : ''}`}
									onClick={() => setActiveTab(tab)}>
									{translateTab(tab)}
								</button>
							))}
						</div>
					</div>

					{renderChart()}
				</div>
			</div>
		</div>
	)
}
