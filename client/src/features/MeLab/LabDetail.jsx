import {
	BiSolidCalendarAlt,
	BiSolidCheckCircle,
	BiSolidCircle,
	BiSolidUserDetail,
	BiSolidXCircle,
} from 'react-icons/bi'
import Avvvatars from 'avvvatars-react'
import { NotFoundSection } from '../404/404'
import { Link, useLocation } from 'react-router-dom'
import { useFindLabToNameStore } from '../../hooks/useLab'
import { NotFound } from '../../components/Banner/NotFound'
import { PATH_PRIVATE } from '../../helpers/constants.helper'
import { LuArchive, LuArrowLeft, LuInfo } from 'react-icons/lu'
import { Status500 } from '../../components/Banner/StatusServer'
import { translateAccess } from '../AccessLab/utils/TypeAccess_ES'
import { formatISOToDate } from '../../helpers/dateTimeZone.helper'
import { useAllAccessPertainLabStore } from '../../hooks/useAccessLab'
import { SpinnerLoading } from '../../components/Loaders/SpinnerLoading'
import { MetricsFilterChart } from './components/Metric/MetricFilterChart'

export const LabDetailSection = () => {
	const location = useLocation()
	const labName = decodeURIComponent(location.pathname).split('/').pop().replace(/-/g, ' ')
	const { lab, loading, error } = useFindLabToNameStore(labName)

	const {
		loading: loadingAccessPertainLab,
		error: errorAccessPertainLab,
		totalRecords,
		accessPertainLabData,
		accessPertainLabMetric,
	} = useAllAccessPertainLabStore(location?.state?.id_lab || lab?.data?.id_lab, 5)

	return (
		<>
			<main class='grid md:grid-cols-3 gap-8'>
				{/* INFO LAB */}
				{loading ? (
					<section className='col-span-2'>
						<div className='space-y-6'>
							<div className='space-y-4'>
								{/* Header Skeleton */}
								<div className='flex items-center gap-4 justify-start'>
									<div className='w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse'></div>
									<div className='h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded animate-pulse'></div>
								</div>

								{/* Date and Description Skeleton */}
								<div className='space-y-2 pt-2'>
									<div className='h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse'></div>
									<div className='h-4 w-3/6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse'></div>
								</div>

								{/* Cards Skeleton */}
								<div className='space-y-8 pt-1'>
									<div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
										{/* Analyst Card Skeleton */}
										<div className='flex flex-col gap-4'>
											<div className='bg-white dark:bg-gray-700/50 rounded-full p-4 space-y-3'>
												<div className='flex items-center gap-3'>
													<div className='w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse'></div>
													<div className='space-y-1'>
														<div className='h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse'></div>
														<div className='h-3 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse'></div>
													</div>
												</div>
											</div>

											{/* Status Card Skeleton */}
											<div className='bg-gray-300 dark:bg-gray-700/50 rounded-full p-3 mt-2 h-11 animate-pulse'></div>
										</div>

										{/* Type Access Card Skeleton */}
										<div className='flex flex-col gap-4'>
											<div className='bg-white dark:bg-gray-700/50 rounded-xl p-4 space-y-4'>
												{[...Array(3)].map((_, index) => (
													<div key={index} className='flex justify-between items-center'>
														<div className='h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse'></div>
														<div className='h-6 w-10 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse'></div>
													</div>
												))}
											</div>
										</div>

										{/* Status Access Card Skeleton */}
										<div className='p-2 space-y-4'>
											{[...Array(3)].map((_, index) => (
												<div key={index} className='flex justify-between items-center'>
													<div className='flex items-center gap-2'>
														<div className='w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse'></div>
														<div className='h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded animate-pulse'></div>
													</div>
													<div className='h-6 w-10 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse'></div>
												</div>
											))}
										</div>
									</div>
								</div>

								{/* Chart Skeleton */}
								<div className='h-64 bg-gray-300 dark:bg-gray-700 rounded-xl animate-pulse'></div>
							</div>
						</div>
					</section>
				) : lab === null ? (
					<section className='col-span-12'>
						<NotFoundSection />
					</section>
				) : (
					<section class='col-span-2'>
						<div className='space-y-6'>
							<div className='space-y-4'>
								<div className='flex items-center gap-4 justify-start'>
									<Link
										to={PATH_PRIVATE.LAB}
										className='dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-300 p-2 rounded-full hover:bg-gray-500 transition-all ease-linear duration-300'>
										<LuArrowLeft />
									</Link>
									<h1 className='text-2xl font-semibold text-slate-600 dark:text-neutral-300 break-words line-clamp-1'>
										{lab?.data?.name}
									</h1>
								</div>

								<div className='space-y-2 pt-2'>
									<p className='text-sm font-medium text-slate-500 dark:text-gray-400 flex items-center gap-1'>
										<BiSolidCalendarAlt />
										Creado el {formatISOToDate(lab?.data?.createdAt)}
									</p>
									<p className='text-base font-medium text-slate-500 dark:text-gray-300 flex items-center gap-2'>
										{lab?.data?.description}
									</p>
								</div>

								<div className='space-y-8'>
									<div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
										<div className='flex flex-col gap-4 text-sm'>
											{/*CARD ANALYST */}
											<div className='bg-white dark:bg-gray-700/50 rounded-full p-3'>
												<ul className='text-gray-700 dark:text-gray-300 space-y-3 font-medium'>
													<li className='flex gap-3 items-center text-base'>
														<Avvvatars size={42} value={lab?.data?.analysts} />
														<div className='flex flex-col'>
															<span>{lab?.data?.analysts}</span>
															<span className='text-sm'>Analista</span>
														</div>
													</li>
												</ul>
											</div>

											{/*CARD STATUS LAB */}
											<div
												className={`rounded-full p-3 mt-1 ${
													lab?.data?.active
														? 'bg-emerald-200 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300'
														: 'bg-red-200 dark:bg-red-400 text-red-700 dark:text-gray-800'
												}`}>
												<ul className='space-y-3 font-medium'>
													<li className='flex flex-col justify-center gap-2 items-center uppercase text-base font-semibold'>
														<span>{lab?.data?.active ? 'Activo' : 'Inactivo'}</span>
													</li>
												</ul>
											</div>
										</div>

										<div className='flex flex-col gap-4 text-sm'>
											{/*CARD TYPE ACCESS */}
											<div className='bg-white dark:bg-gray-700/50 rounded-xl p-4'>
												<ul className='text-gray-700 dark:text-gray-300 space-y-2.5 font-medium'>
													<li className='flex justify-between items-center'>
														<span>Accesos totales</span>
														<span className='dark:bg-gray-800 bg-gray-300 dark:text-gray-300 text-gray-500 px-2.5 py-1 rounded-full'>
															{totalRecords || 0}
														</span>
													</li>

													<li className='flex justify-between items-center'>
														<span>Accesos internos</span>
														<span className='dark:text-blue-300 text-blue-500 px-2.5 py-1 rounded-full'>
															{accessPertainLabMetric?.totalByTypeAccess?.access_internal || 0}
														</span>
													</li>
													<li className='flex justify-between items-center'>
														<span>Accesos externos</span>
														<span className=' dark:text-orange-300 text-orange-500 px-2.5 py-1 rounded-full'>
															{accessPertainLabMetric?.totalByTypeAccess?.access_public || 0}
														</span>
													</li>
												</ul>
											</div>
										</div>

										{/*CARD STATUS ACCESS */}
										<div className='p-2'>
											<ul className='text-gray-700 dark:text-gray-300 space-y-4 font-medium text-sm'>
												<li className='flex justify-between items-center'>
													<div className='flex items-center gap-2'>
														<div className='dark:bg-emerald-700/50 p-2 rounded-lg'>
															<BiSolidCheckCircle />
														</div>
														<span>Aprobados</span>
													</div>
													<span className='dark:text-emerald-400 dark:bg-gray-700 bg-emerald-100 text-emerald-500 px-2.5 py-1 rounded-full'>
														{accessPertainLabMetric?.totalByStatus?.approved || 0}
													</span>
												</li>
												<li className='flex justify-between items-center'>
													<div className='flex items-center gap-2'>
														<div className='dark:bg-yellow-700/50 p-2 rounded-lg'>
															<BiSolidCircle />
														</div>
														<span>Pendientes</span>
													</div>
													<span className='dark:text-yellow-400 dark:bg-gray-700 bg-yellow-100 text-yellow-500 px-2.5 py-1 rounded-full'>
														{accessPertainLabMetric?.totalByStatus?.pending || 0}
													</span>
												</li>
												<li className='flex justify-between items-center'>
													<div className='flex items-center gap-2'>
														<div className='dark:bg-red-700/50 p-2 rounded-lg'>
															<BiSolidXCircle />
														</div>
														<span>Rechazados</span>
													</div>
													<span className='dark:text-red-400 dark:bg-gray-700 bg-red-100 text-red-500 px-2.5 py-1 rounded-full'>
														{accessPertainLabMetric?.totalByStatus?.rejected || 0}
													</span>
												</li>
											</ul>
										</div>
									</div>
								</div>

								<MetricsFilterChart accessPertainLabMetric={accessPertainLabMetric} />
							</div>
						</div>
					</section>
				)}

				{/* RECENT ACCES LABS */}
				{loadingAccessPertainLab ? (
					<section className='w-full bg-slate-50 dark:bg-gray-700/60 rounded-xl p-6'>
						<div className='space-y-4'>
							<div className='flex items-center justify-between'>
								<span className='h-4 w-40 bg-slate-200 dark:bg-gray-600 rounded-full animate-pulse'></span>
								<span className='h-4 w-14 bg-slate-200 dark:bg-gray-600 rounded-full animate-pulse'></span>
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
					lab && (
						<section className='w-full bg-slate-50 dark:bg-gray-700/60 rounded-xl p-6'>
							<div className='space-y-4'>
								<h2 className='text-lg font-semibold text-slate-600 dark:text-neutral-300'>Accesos recientes</h2>

								<div className='space-y-1'>
									{loadingAccessPertainLab ? (
										<div className='flex justify-center py-32'>
											<SpinnerLoading />
										</div>
									) : errorAccessPertainLab ? (
										<div className='flex justify-center py-32'>
											<NotFound icon={<LuInfo size={50} />} description={errorAccessPertainLab} />
										</div>
									) : accessPertainLabData?.length > 0 ? (
										accessPertainLabData.map(item => (
											<div key={item?.id_access_lab}>
												<div className='space-y-4 text-sm border-t dark:border-gray-700 py-3 dark:text-gray-400 font-medium'>
													<div className='flex justify-between items-center text-xs text-slate-500 dark:text-gray-400'>
														<span className='flex items-center gap-1 text-slate-400 dark:text-gray-300/80'>
															{formatISOToDate(item?.createdAt)}
														</span>
														<div className='flex items-center gap-2 text-xs font-medium'>
															<span
																className={`px-2 py-0.5 rounded-full ${
																	item?.type_access === 'access_internal'
																		? 'dark:bg-blue-600/30 bg-blue-100 dark:text-blue-300 text-blue-500'
																		: 'dark:bg-orange-600/30 bg-orange-100 dark:text-orange-300 text-orange-500'
																}`}>
																{translateAccess(item?.type_access)}
															</span>
															<span
																className={`px-2 py-0.5 rounded-full ${
																	{
																		Aprobado:
																			'dark:text-emerald-300 dark:bg-emerald-700/50 bg-emerald-100 text-emerald-500',
																		Pendiente:
																			'dark:text-yellow-300 dark:bg-yellow-700/50 bg-yellow-100 text-yellow-500',
																		Rechazado: 'dark:text-red-300 dark:bg-red-700/50 bg-red-100 text-red-500',
																	}[item.status]
																}`}>
																{item?.status}
															</span>
														</div>
													</div>

													<div className='flex items-center gap-1.5 dark:text-gray-300'>
														<p className='uppercase break-words line-clamp-2'>{item?.topic}</p>
													</div>

													<div className='flex items-center gap-1.5'>
														<p className='text-slate-500 dark:text-gray-300/90 flex flex-col gap-1'>
															{item?.applicants?.map((applicant, index) => (
																<div className='flex items-center gap-2 text-xs'>
																	<BiSolidUserDetail />
																	<span key={index}>{applicant?.name}</span>
																</div>
															))}
														</p>
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
					)
				)}
			</main>
		</>
	)
}
