import { Line } from 'react-chartjs-2'
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const ChartCard = () => {
	const data = {
		labels: ['1 Nov', '2 Nov', '3 Nov', '4 Nov', '5 Nov', '6 Nov'],
		datasets: [
			{
				label: 'Procesos de análisis',
				data: [12, 20, 15, 30, 22, 35],
				borderColor: '#4f46e5',
				borderWidth: 2,
				fill: false,
			},
		],
	}

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			x: {
				grid: { color: '#444' },
				ticks: { color: '#aaa' },
				title: {
					display: true,
					text: 'Fecha',
					color: '#ccc',
				},
			},
			y: {
				grid: { color: '#444' },
				ticks: { color: '#aaa' },
				title: {
					display: true,
					text: 'Cantidad de procesos',
					color: '#ccc',
				},
				min: 0,
			},
		},
		plugins: {
			legend: {
				labels: { color: '#ccc' },
			},
			tooltip: {
				backgroundColor: '#333',
				titleColor: '#fff',
				bodyColor: '#fff',
			},
		},
	}

	return (
		<div className='p-4 bg-gray-900 rounded-lg shadow min-h-[250px]'>
			<Line data={data} options={options} />
		</div>
	)
}

export { ChartCard }
