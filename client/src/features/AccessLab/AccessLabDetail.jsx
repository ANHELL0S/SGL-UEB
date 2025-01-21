import { useLocation } from 'react-router-dom'
import { useAccessLabStore } from '../../hooks/useAccessLab'
import { SpinnerLoading } from '../../components/Loaders/SpinnerLoading'
import { Status500 } from '../../components/Banner/StatusServer'
import {
	BiIdCard,
	BiCard,
	BiDotsVerticalRounded,
	BiSolidBadgeCheck,
	BiSolidInfoCircle,
	BiSolidCalendarAlt,
} from 'react-icons/bi'
import Avvvatars from 'avvvatars-react'
import { LuFlaskConical } from 'react-icons/lu'
import { formatISOToDate } from '../../helpers/dateTimeZone.helper'
import { translateAccess } from './utils/TypeAccess_ES'

export const AccessLabDetailSection = () => {
	const location = useLocation()
	const { state } = location
	const { id_access_lab } = state || {}

	const { data, loading, error } = useAccessLabStore(id_access_lab)

	if (loading) {
		return (
			<div className='flex h-screen items-center justify-center bg-slate-50 dark:bg-neutral-800'>
				<SpinnerLoading />
			</div>
		)
	}

	if (error) return <Status500 text={error} />

	return (
		<>
			<main className='space-y-8'>
				<section className='flex items-center gap-4 justify-between'>
					<h1 className='text-sm font-medium text-slate-800 dark:text-gray-300 flex items-center gap-2'>
						<BiSolidCalendarAlt />
						{formatISOToDate(data?.createdAt)}
					</h1>

					<div className='dark:bg-gray-600 p-2 rounded-full'>
						<h1 className='text-sm font-semibold text-slate-300'>
							<BiDotsVerticalRounded />
						</h1>
					</div>
				</section>

				<section className='flex items-center justify-between'>
					<div className='flex items-center gap-4'>
						<Avvvatars size={64} value={data?.applicant_names} />
						<div className='font-medium'>
							<p className='text-xl font-semibold text-slate-600 dark:text-neutral-300'>{data?.applicant_names}</p>
							<p className='text-sm text-slate-600 dark:text-neutral-400 flex items-center gap-1'>
								<BiIdCard />
								<span>{data?.dni}</span>
							</p>
						</div>
					</div>

					<div className='text-xs text-neutral-600 dark:text-neutral-400 flex gap-2 font-semibold'>
						<div
							className={`break-words line-clamp-1 flex items-center gap-1 rounded-full px-3 py-2 ${
								data.type_access === 'access_internal'
									? 'dark:bg-blue-600/30 bg-blue-100 dark:text-blue-300 text-blue-500'
									: 'dark:bg-orange-600/30 bg-orange-100 dark:text-orange-300 text-orange-500'
							}`}>
							<span className='flex items-center gap-1'>
								<BiSolidInfoCircle size={18} />
								{translateAccess(data.type_access)}
							</span>
						</div>

						<div
							className={`break-words line-clamp-1 flex items-center gap-1 rounded-full px-3 py-2 ${
								{
									Aprobado: 'dark:text-emerald-300 dark:bg-emerald-700/50 bg-emerald-100 text-emerald-500',
									Pendiente: 'dark:text-yellow-300 dark:bg-yellow-700/50 bg-yellow-100 text-yellow-500',
									Rechazado: 'dark:text-red-300 dark:bg-red-700/50 bg-red-100 text-red-500',
								}[data?.status]
							}`}>
							<span className='flex items-center gap-1'>
								<BiSolidBadgeCheck size={18} />
								{data?.status}
							</span>
						</div>
					</div>
				</section>

				<section className='grid grid-cols-2 gap-6'>
					<div className='flex flex-col gap-4 justify-between'>
						{/* Laboratorio */}
						<div className='flex items-center space-x-4 p-4 rounded-xl dark:bg-gray-700'>
							<div className='p-3 bg-pink-100 dark:bg-pink-900 rounded-full'>
								<BiCard className='text-pink-500 dark:text-pink-300 text-xl' />
							</div>
							<div>
								<h3 className='text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase'>Laboratorio</h3>
								<p className='text-sm text-neutral-800 dark:text-neutral-300'>{data?.lab?.name_lab}</p>
							</div>
						</div>

						{/* Experimento */}
						<div className='flex items-center space-x-4 p-4 rounded-xl dark:bg-gray-700'>
							<div className='p-3 bg-indigo-100 dark:bg-indigo-900 rounded-full'>
								<LuFlaskConical className='text-indigo-500 dark:text-indigo-300 text-xl' />
							</div>
							<div>
								<h3 className='text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase'>Experimento</h3>
								<p className='text-sm text-neutral-800 dark:text-neutral-300'>{data?.experiment?.name_experiment}</p>
							</div>
						</div>
					</div>

					<div className='flex flex-col gap-4 justify-between'>
						{/* Laboratorio */}
						<div className='flex items-center space-x-4 p-4 rounded-xl dark:bg-gray-700'>
							<div className='p-3 bg-pink-100 dark:bg-pink-900 rounded-full'>
								<BiCard className='text-pink-500 dark:text-pink-300 text-xl' />
							</div>
							<div>
								<h3 className='text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase'>Laboratorio</h3>
								<p className='text-sm text-neutral-800 dark:text-neutral-300'>{data?.lab?.name_lab}</p>
							</div>
						</div>

						{/* Experimento */}
						<div className='flex items-center space-x-4 p-4 rounded-xl dark:bg-gray-700'>
							<div className='p-3 bg-indigo-100 dark:bg-indigo-900 rounded-full'>
								<LuFlaskConical className='text-indigo-500 dark:text-indigo-300 text-xl' />
							</div>
							<div>
								<h3 className='text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase'>Experimento</h3>
								<p className='text-sm text-neutral-800 dark:text-neutral-300'>{data?.experiment?.name_experiment}</p>
							</div>
						</div>
					</div>
				</section>
			</main>
		</>
	)
}
