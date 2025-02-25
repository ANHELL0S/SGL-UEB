import {
	BiMap,
	BiUser,
	BiPhone,
	BiIdCard,
	BiWallet,
	BiEnvelope,
	BiSolidAnalyse,
	BiSolidCalendarAlt,
} from 'react-icons/bi'
import { useState } from 'react'
import { LuArrowLeft } from 'react-icons/lu'
import { NotFoundSection } from '@/features/404/404'
import { Link, useLocation } from 'react-router-dom'
import { useQuoteByCodeStore } from '@/hooks/useQuote'
import { PATH_PRIVATE } from '@/helpers/constants.helper'
import { ReportCard } from './components/Card/ReportCard'
import { Status500 } from '@/components/Banner/StatusServer'
import { formatISOToDate } from '@/helpers/dateTimeZone.helper'
import { LabsCard } from '@/features/Quote/components/Card/LabsCard'
import { AnalysCard } from '@/features/Quote/components/Card/AnalysCard'
import { SamplesCard } from '@/features/Quote/components/Card/SamplesCard'
import { QuoteActions } from '@/features/Quote/components/dropdown/Dropdpwn'
import { ConsumptionReactive } from '@/features/Quote/components/Card/ConsumptionReactive'

export const QuoteDetailSection = () => {
	const location = useLocation()
	const quoteCode = location.pathname.split('/').pop()
	const { quoteData, fetchQuoteData, loading, error } = useQuoteByCodeStore(quoteCode)
	const [activeTab, setActiveTab] = useState('labs')

	if (error) {
		if (error?.code === 404) return <NotFoundSection />
		return <Status500 text={error} />
	}

	if (quoteData?.deletedAt) return <NotFoundSection />

	return (
		<>
			<main className='grid md:grid-cols-5 gap-12'>
				{loading ? (
					<>
						<section className='col-span-2 space-y-6 animate-pulse'>
							<div className='flex items-center justify-between gap-4'>
								<div className='flex items-center gap-4'>
									<div className='w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full'></div>
									<div className='w-32 h-6 bg-gray-300 dark:bg-gray-600 rounded'></div>
								</div>
								<div className='w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full'></div>
							</div>

							<div className='flex flex-col gap-4 bg-slate-100 dark:bg-gray-700/60 p-4 h-56 rounded-xl'></div>
							<div className='flex flex-col gap-4 bg-slate-100 dark:bg-gray-700/60 p-4 h-16 rounded-xl'></div>
						</section>

						<section className='col-span-3 rounded-xl space-y-4 animate-pulse'>
							<div className='h-60 w-auto bg-gray-300 dark:bg-gray-600 rounded'></div>
						</section>
					</>
				) : (
					<>
						<section className='md:col-span-2 col-span-3'>
							<div className='space-y-6'>
								<div className='flex justify-between items-center gap-4'>
									<div className='flex items-center gap-4'>
										<Link
											to={PATH_PRIVATE.ACCESS_QUOTE}
											className='dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-300 bg-gray-200 hover:bg-gray-300 text-gray-600 p-2 rounded-full transition-all ease-linear duration-300'>
											<LuArrowLeft />
										</Link>
										<h1 className='text-2xl font-semibold text-slate-600 dark:text-neutral-200'>{quoteData?.code}</h1>
									</div>

									<QuoteActions quoteData={quoteData} fetchQuoteData={fetchQuoteData} />
								</div>

								<div className='space-y-4'>
									<div className='flex items-center justify-between'>
										<p className='text-xs font-medium text-slate-500 dark:text-gray-400 flex items-center gap-1'>
											<BiSolidCalendarAlt /> Creado el {formatISOToDate(quoteData?.createdAt)}
										</p>
										<div
											className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center ${
												{
													Aprobado: 'bg-emerald-100 text-emerald-500 dark:bg-emerald-700/50 dark:text-emerald-300',
													Pendiente: 'bg-yellow-100 text-yellow-500 dark:bg-yellow-700/50 dark:text-yellow-300',
													Rechazado: 'bg-red-100 text-red-500 dark:bg-red-700/50 dark:text-red-300',
												}[quoteData?.status]
											}`}>
											<div className='flex items-center space-x-2'>
												<span>{quoteData?.status}</span>
											</div>
										</div>
									</div>
								</div>

								<div className='max-h-screen overflow-auto space-y-6'>
									{/* PERSONAL INFO */}
									<div className='flex flex-col gap-4 dark:bg-gray-700/40 bg-slate-100 p-4 rounded-lg dark:text-gray-300 text-slate-600 border dark:border-gray-700'>
										<h2 className='text-lg font-semibold flex items-center gap-2'>Datos personales</h2>

										<div className='space-y-2 text-sm'>
											<p className='flex items-center gap-2'>
												<BiUser />
												<strong>Nombre:</strong> {quoteData?.name}
											</p>
											<p className='flex items-center gap-2'>
												<BiIdCard />
												<strong>Cédula:</strong> {quoteData?.dni}
											</p>
											<p className='flex items-center gap-2'>
												<BiEnvelope />
												<strong>Email:</strong> {quoteData?.email}
											</p>
											<p className='flex items-center gap-2'>
												<BiPhone />
												<strong>Teléfono:</strong> {quoteData?.phone}
											</p>
											<p className='flex items-center gap-2'>
												<BiMap />
												<strong>Dirección:</strong> {quoteData?.direction}
											</p>
										</div>
									</div>

									{/* INFO SAMPLE */}
									<div className='flex flex-col gap-4 dark:bg-gray-700/40 bg-slate-100 p-4 rounded-lg dark:text-gray-300 text-slate-600 border dark:border-gray-700'>
										<h2 className='text-lg font-semibold flex items-center gap-2'>Datos muestra general</h2>

										<div className='space-y-2 text-sm'>
											<div className='flex items-center gap-4 dark:bg-gray-800/80 p-4 rounded-lg'>
												<div className='bg-lime-200 p-2 rounded-full text-gray-700'>
													<BiSolidAnalyse size={24} />
												</div>
												<div className='flex items-center justify-between w-full'>
													<p className='flex items-center gap-2'>
														<strong>Tipo: </strong>
														{quoteData?.type_sample}
													</p>
													<p className='flex items-center gap-2'>
														<strong>Cantidad: </strong>
														{quoteData?.amount_sample}
													</p>
												</div>
											</div>
											<p className='flex items-center gap-2'>
												<strong>Detalle :</strong>
												{quoteData?.detail_sample}
											</p>
										</div>
									</div>

									{/* INFO BILL */}
									<div
										className={`${
											quoteData?.bill ? 'bg-green-100' : 'bg-red-100'
										} p-4 rounded-xl flex items-center gap-4`}>
										<div className={`${quoteData?.bill ? 'text-green-700' : 'text-red-600'}`}>
											<h2 className='text-xl font-semibold flex items-center gap-2'>
												{quoteData?.bill && (
													<>
														<BiWallet className='text-xl' />
														<span>Depósito: </span>
													</>
												)}
												<span className='font-bold text-base'>{quoteData?.bill}</span>
											</h2>
											<span className='font-bold text-base'>
												{quoteData?.bill ? quoteData?.bill : 'Aún no se ha realizado el depósito'}
											</span>
										</div>
									</div>

									{/* QUOTE PDF */}
									<div className='text-slate-600 dark:text-gray-300'>
										{quoteData?.pdf ? (
											<>
												<div className='flex items-center justify-between py-4'>
													<h2 className='text-lg font-semibold flex items-center gap-2'>Cotización</h2>
													<a
														href={`data:application/pdf;base64,${quoteData?.pdf?.pdfQuote}`}
														download='cotizacion.pdf'
														className='mt-2 text-blue-500 underline font-semibold text-sm'>
														Descargar
													</a>
												</div>
												{/* Vista previa del PDF */}
												<div className='w-full h-96'>
													<iframe
														className='w-full h-full'
														src={`data:application/pdf;base64,${quoteData?.pdf?.pdfQuote}`}
														title='Vista previa del PDF'
													/>
												</div>
											</>
										) : (
											<h2 className='text-xl font-semibold text-red-600'>No hay PDF disponible</h2>
										)}
									</div>
								</div>
							</div>
						</section>

						<section className='col-span-3 space-y-4'>
							<section className='flex text-sm rounded-lg space-x-2 font-semibold'>
								<button
									className={`p-1 transition-all ease-in-out duration-200 ${
										activeTab === 'labs'
											? 'border-b-2 dark:text-gray-200 dark:border-gray-200 text-gray-500 border-slate-500'
											: 'dark:border-gray-200 hover:dark:text-gray-300 border-slate-200 hover:text-slate-500 border-b-2 dark:border-transparent border-transparent'
									}`}
									onClick={() => setActiveTab('labs')}>
									Laboratorios
								</button>
								<button
									className={`p-1 transition-all ease-in-out duration-200 ${
										activeTab === 'analys'
											? 'border-b-2 dark:text-gray-200 dark:border-gray-200 text-gray-500 border-slate-500'
											: 'dark:border-gray-200 hover:dark:text-gray-300 border-slate-200 hover:text-slate-500 border-b-2 dark:border-transparent border-transparent'
									}`}
									onClick={() => setActiveTab('analys')}>
									Análisis
								</button>
								<button
									className={`p-1 transition-all ease-in-out duration-200 ${
										activeTab === 'samples'
											? 'border-b-2 dark:text-gray-200 dark:border-gray-200 text-gray-500 border-slate-500'
											: 'dark:border-gray-200 hover:dark:text-gray-300 border-slate-200 hover:text-slate-500 border-b-2 dark:border-transparent border-transparent'
									}`}
									onClick={() => setActiveTab('samples')}>
									Muestras
								</button>
								<button
									className={`p-1 transition-all ease-in-out duration-200 ${
										activeTab === 'report'
											? 'border-b-2 dark:text-gray-200 dark:border-gray-200 text-gray-500 border-slate-500'
											: 'dark:border-gray-200 hover:dark:text-gray-300 border-slate-200 hover:text-slate-500 border-b-2 dark:border-transparent border-transparent'
									}`}
									onClick={() => setActiveTab('report')}>
									Informes
								</button>
								<button
									className={`p-1 transition-all ease-in-out duration-200 ${
										activeTab === 'consumptionReactives'
											? 'border-b-2 dark:text-gray-200 dark:border-gray-200 text-gray-500 border-slate-500'
											: 'dark:border-gray-200 hover:dark:text-gray-300 border-slate-200 hover:text-slate-500 border-b-2 dark:border-transparent border-transparent'
									}`}
									onClick={() => {
										setActiveTab('consumptionReactives')
										fetchQuoteData()
									}}>
									Cosumo reactivos
								</button>
							</section>

							{activeTab === 'labs' && !loading && quoteData && <LabsCard quoteData={quoteData} />}
							{activeTab === 'analys' && !loading && quoteData && <AnalysCard quoteData={quoteData} />}
							{activeTab === 'samples' && !loading && quoteData && <SamplesCard quoteData={quoteData} />}
							{activeTab === 'report' && !loading && quoteData && <ReportCard quoteData={quoteData} />}
							{activeTab === 'consumptionReactives' && !loading && quoteData && (
								<ConsumptionReactive quoteData={quoteData} />
							)}
						</section>
					</>
				)}
			</main>
		</>
	)
}
