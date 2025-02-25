import { BiSolidCalendarAlt } from 'react-icons/bi'
import { NotFoundSection } from '../404/404'
import { Link, useLocation } from 'react-router-dom'
import { useFindLabToNameStore } from '../../hooks/useLab'
import { PATH_PRIVATE } from '../../helpers/constants.helper'
import { LuArrowLeft } from 'react-icons/lu'
import { Status500 } from '../../components/Banner/StatusServer'
import { formatISOToDate } from '../../helpers/dateTimeZone.helper'
import { AccessToLab } from './components/Card/AccessToLab'
import { SummaryAccess } from './components/Card/SumaryAccess'

export const LabDetailSection = () => {
	const location = useLocation()
	const labName = decodeURIComponent(location.pathname).split('/').pop().replace(/-/g, ' ')
	const { lab, loading, error } = useFindLabToNameStore(labName)

	if (error) {
		if (error.code === 404) return <NotFoundSection />
		return <Status500 text={error} />
	}

	if (lab?.deletedAt) return <NotFoundSection />

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
											<div className='bg-white dark:bg-gray-700/50 rounded-xl p-4 space-y-3 h-10 w-full'></div>

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
				) : (
					<section class='col-span-2'>
						<div className='space-y-6 col-span-1'>
							<div className='space-y-4'>
								<div className='flex items-center gap-4 justify-start'>
									<Link
										to={PATH_PRIVATE.LAB}
										className='dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-300 p-2 rounded-full hover:bg-gray-300 bg-slate-200 text-slate-500 transition-all ease-linear duration-300'>
										<LuArrowLeft />
									</Link>
									<h1 className='text-2xl font-semibold text-slate-600 dark:text-neutral-300 break-words line-clamp-1'>
										{lab?.data?.name}
									</h1>
								</div>

								<div className='space-y-2 pb-4'>
									<p className='text-sm font-medium text-slate-500 dark:text-gray-400 flex items-center gap-1'>
										<BiSolidCalendarAlt />
										Creado el {formatISOToDate(lab?.data?.createdAt)}
									</p>
									<p className='text-base font-medium text-slate-500 dark:text-gray-300 flex items-center gap-2'>
										{lab?.data?.description}
									</p>
								</div>

								{!loading && lab && <SummaryAccess labData={lab} />}
							</div>
						</div>
					</section>
				)}
				{/* CARD ANALYSIS */}
				<div className='md:col-span-1 col-span-2'>{!loading && lab && <AccessToLab labData={lab} />}</div>
			</main>
		</>
	)
}
