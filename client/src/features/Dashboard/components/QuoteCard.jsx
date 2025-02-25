import { BiSolidCalendarAlt } from 'react-icons/bi'
import { LuArchive } from 'react-icons/lu'
import { formatISOToDate } from '../../../helpers/dateTimeZone.helper'
import { NotFound } from '@/components/Banner/NotFound'

export const QuoteCard = ({ quotesData, loading }) => {
	if (loading) {
		return (
			<>
				{[1, 2, 3].map(i => (
					<main
						key={i}
						className='animate-pulse p-6 border dark:border-gray-700 rounded-lg flex items-center space-x-4 mb-4'>
						<div className='flex flex-col gap-4 w-full'>
							<section className='flex justify-between items-center'>
								<div className='flex items-center gap-1 text-xs'>
									{/* Placeholder para la fecha */}
									<div className='w-20 h-3 bg-gray-300 dark:bg-gray-600 rounded'></div>
								</div>
								<div className='space-x-2'>
									{/* Placeholder para el estado */}
									<div className='w-14 h-3 bg-gray-300 dark:bg-gray-600 rounded'></div>
								</div>
							</section>
							<section className='flex justify-between items-center gap-4 text-sm font-medium'>
								{/* Placeholder para el nombre */}
								<div className='w-36 h-3 bg-gray-300 dark:bg-gray-600 rounded'></div>
								{/* Placeholder para el código */}
								<div className='w-28 h-3 bg-gray-300 dark:bg-gray-600 rounded'></div>
							</section>
						</div>
					</main>
				))}
			</>
		)
	}

	if (quotesData?.data?.quotes?.length === 0) {
		return (
			<div className='py-20 dark:bg-gray-700/50 rounded-xl'>
				<NotFound
					icon={<LuArchive size={46} />}
					title='Sin cotizaciones'
					description='Aún no se ha realizado ninguna cotización.'
				/>
			</div>
		)
	}

	return (
		<>
			{quotesData?.data?.quotes?.map(quote => (
				<main
					key={quote?.id_quote}
					className='p-4 border dark:border-gray-700 rounded-lg flex items-center space-x-4 mb-4'>
					<div className='flex flex-col gap-2 w-full dark:text-gray-200 text-slate-500'>
						<section className='flex justify-between items-center'>
							<div className='flex items-center gap-1 text-xs'>
								<BiSolidCalendarAlt />
								<p>{formatISOToDate(quote?.createdAt)}</p>
							</div>
							<div className='space-x-2'>
								<span
									className={`font-semibold text-xs ${
										{
											Aprobado: 'dark:text-emerald-300 text-emerald-500',
											Pendiente: 'dark:text-yellow-300 text-yellow-500',
											Rechazado: 'dark:text-red-300 text-red-500',
										}[quote?.status]
									}`}>
									{quote?.status}
								</span>
							</div>
						</section>
						<section className='flex justify-between items-center gap-4 dark:text-gray-300 text-slate-500 text-sm font-medium'>
							<p>{quote?.name}</p>
							<span className='text-xs'>{quote?.code}</span>
						</section>
					</div>
				</main>
			))}
		</>
	)
}
