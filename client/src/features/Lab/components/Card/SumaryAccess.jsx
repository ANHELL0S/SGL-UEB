import { BiSolidCheckCircle, BiSolidCircle, BiSolidXCircle } from 'react-icons/bi'
import { useAllAccessPertainLabStore } from '../../../../hooks/useAccessLab'
import { MetricsFilterChart } from '../Metric/MetricFilterChart'

export const SummaryAccess = ({ labData }) => {
	const { loading, error, totalRecords, accessPertainLabData, accessPertainLabMetric } = useAllAccessPertainLabStore(
		labData?.data?.id_lab
	)

	return (
		<>
			<div className='space-y-8'>
				<div className='grid grid-cols-1 sm:grid-cols-3 gap-8'>
					<div className='flex flex-col gap-4 text-sm'>
						{/*CARD ANALYST */}
						<div className='bg-slate-100 dark:bg-gray-700/50 border dark:border-gray-700 rounded-xl p-3 flex flex-col'>
							<span className='text-gray-600 dark:text-gray-300 space-y-3 font-medium break-words line-clamp-1'>
								{labData?.data?.analysts}
							</span>
							<span>Analista</span>
						</div>

						{/*CARD STATUS LAB */}
						<div
							className={`rounded-full p-3 mt-2 ${
								labData?.data?.active
									? 'bg-emerald-200 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300'
									: 'bg-red-200 dark:bg-red-400 text-red-700 dark:text-gray-800'
							}`}>
							<ul className='space-y-3 font-medium'>
								<li className='flex flex-col justify-center gap-2 items-center uppercase text-base font-semibold'>
									<span>{labData?.data?.active ? 'Activo' : 'Inactivo'}</span>
								</li>
							</ul>
						</div>
					</div>

					<div className='flex flex-col gap-4 text-sm'>
						{/*CARD TYPE ACCESS */}
						<div className='bg-slate-100 border dark:border-gray-700 dark:bg-gray-700/50 rounded-xl p-4'>
							<ul className='text-gray-600 dark:text-gray-300 space-y-2.5 font-medium'>
								<li className='flex justify-between items-center'>
									<span>Accesos totales</span>
									<span className='dark:bg-gray-800 bg-gray-300 dark:text-gray-300 text-gray-500 px-2.5 py-1 rounded-full'>
										{totalRecords || 0}
									</span>
								</li>
							</ul>
						</div>
					</div>

					{/*CARD STATUS ACCESS */}
					<div>
						<ul className='text-gray-700 dark:text-gray-300 space-y-3 font-medium text-sm'>
							<li className='flex justify-between items-center'>
								<div className='flex items-center gap-2'>
									<div className='bg-emerald-300 text-gray-700 p-2 rounded-lg'>
										<BiSolidCheckCircle />
									</div>
									<span>Aprobados</span>
								</div>
								<span className='text-emerald-400 text-base'>
									{accessPertainLabMetric?.totalByStatus?.approved || 0}
								</span>
							</li>
							<hr className='dark:border-gray-700' />
							<li className='flex justify-between items-center'>
								<div className='flex items-center gap-2'>
									<div className='bg-orange-300 text-gray-700 p-2 rounded-lg'>
										<BiSolidCircle />
									</div>
									<span>Pendientes</span>
								</div>
								<span className='text-orange-400 text-base'>{accessPertainLabMetric?.totalByStatus?.pending || 0}</span>
							</li>
							<hr className='dark:border-gray-700' />
							<li className='flex justify-between items-center'>
								<div className='flex items-center gap-2'>
									<div className='bg-red-300 text-gray-700 p-2 rounded-lg'>
										<BiSolidXCircle />
									</div>
									<span>Rechazados</span>
								</div>
								<span className='text-red-400 text-base'>{accessPertainLabMetric?.totalByStatus?.rejected || 0}</span>
							</li>
						</ul>
					</div>
				</div>

				<MetricsFilterChart accessPertainLabMetric={accessPertainLabMetric} />
			</div>
		</>
	)
}
