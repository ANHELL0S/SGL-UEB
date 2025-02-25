import { LuArchive } from 'react-icons/lu'
import { NotFound } from '../../../../components/Banner/NotFound'
import { useAllAccessPertainLabStore } from '../../../../hooks/useAccessLab'
import { BiSolidRightArrowAlt } from 'react-icons/bi'
import { formatISOToDate } from '../../../../helpers/dateTimeZone.helper'
import { translateAccess } from '../../../AccessLab/utils/TypeAccess_ES'
import { Link } from 'react-router-dom'
import { PATH_PRIVATE } from '../../../../helpers/constants.helper'

export const AccessToLab = ({ labData }) => {
	const { loading, error, totalRecords, accessPertainLabData, accessPertainLabMetric } = useAllAccessPertainLabStore(
		labData?.data?.id_lab
	)

	return (
		<>
			{loading ? (
				<section className='w-full'>
					<div className='space-y-4'>
						<div className='flex items-center justify-between'>
							<span className='h-4 w-40 bg-slate-200 dark:bg-gray-600 rounded-full animate-pulse'></span>
						</div>

						<div className='space-y-4'>
							{Array.from({ length: 4 }).map((_, index) => (
								<div key={index} className='space-y-4 border-t dark:border-gray-700 py-3 animate-pulse'>
									<div className='flex justify-between items-center text-xs'>
										<span className='h-3 w-16 bg-slate-200 dark:bg-gray-600 rounded'></span>
										<div className='flex items-center justify-between'>
											<div className='flex gap-2'>
												<span className='h-5 w-12 bg-slate-200 dark:bg-gray-600 rounded-full'></span>
												<span className='h-5 w-16 bg-slate-200 dark:bg-gray-600 rounded-full'></span>
											</div>
										</div>
									</div>

									<div className='h-8 w-full bg-slate-200 dark:bg-gray-600 rounded'></div>

									<div className='flex items-center gap-1.5 pt-2'>
										<span className='h-4 w-6 bg-slate-200 dark:bg-gray-600 rounded'></span>
										<span className='h-3 w-28 bg-slate-200 dark:bg-gray-600 rounded'></span>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>
			) : (
				<section className='w-full'>
					<div className='space-y-4'>
						<h2 className='text-lg font-semibold text-slate-600 dark:text-neutral-300'>Accesos recientes</h2>

						<div className='space-y-1'>
							{error ? (
								<div className='flex justify-center py-32'>
									<NotFound icon={<LuInfo size={50} />} description={error} />
								</div>
							) : accessPertainLabData?.length > 0 ? (
								accessPertainLabData.map(item => (
									<div key={item?.id_access_lab}>
										<div className='space-y-2 text-sm border-t dark:border-gray-700 py-3 dark:text-gray-400 font-medium'>
											<div className='flex justify-between items-center text-xs text-slate-500 dark:text-gray-400'>
												<span className='flex items-center gap-1 text-slate-500 dark:text-gray-300/80'>
													{formatISOToDate(item?.createdAt)}
												</span>
											</div>

											<div className='flex justify-between gap-1 dark:text-gray-300 text-slate-500'>
												<p
													className={`text-xs break-words line-clamp-2 ${item?.deletedAt ? 'line-through text-red-400' : ''}`}>
													{item?.code}
												</p>
												<div className='flex items-center gap-2 text-xs font-medium'>
													<span
														className={`px-2 py-0.5 rounded-full ${
															{
																Aprobado:
																	'dark:text-emerald-300 dark:bg-emerald-700/50 bg-emerald-100 text-emerald-500',
																Pendiente: 'dark:text-yellow-300 dark:bg-yellow-700/50 bg-yellow-100 text-yellow-500',
																Rechazado: 'dark:text-red-300 dark:bg-red-700/50 bg-red-100 text-red-500',
															}[item.status]
														}`}>
														{item.status}
													</span>
												</div>
											</div>
										</div>
									</div>
								))
							) : (
								<div className='flex justify-center py-32'>
									<NotFound icon={<LuArchive size={36} />} title='Laboratorio sin accesos' />
								</div>
							)}
						</div>
					</div>
				</section>
			)}
		</>
	)
}
