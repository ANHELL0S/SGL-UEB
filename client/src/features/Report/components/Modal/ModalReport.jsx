import { BiX } from 'react-icons/bi'
import { Banner } from '../Banner/Banner'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LuArchive, LuSearch, LuX } from 'react-icons/lu'
import { useAllUsersStore } from '../../../../hooks/useUser'
import { Button } from '../../../../components/Button/Button'
import { NotFound } from '../../../../components/Banner/NotFound'
import { ToastGeneric } from '../../../../components/Toasts/Toast'
import { useAllSamplesStore } from '../../../../hooks/useSample'
import { getReportRequest } from '../../../../services/api/report.api'
import { Status500 } from '../../../../components/Banner/StatusServer'
import { SpinnerLoading } from '../../../../components/Loaders/SpinnerLoading'

const ReportModal = ({ onClose }) => {
	const [loading, setLoading] = useState(false)
	const [modalOpen, setModalOpen] = useState(false)

	const [endDate, setEndDate] = useState('')
	const [startDate, setStartDate] = useState('')
	// Inicialmente, sin filtro de estado (Todos = null)
	const [statusReport, setStatusReport] = useState(null)
	const [selectedUsers, setSelectedUsers] = useState(null)
	const [selectedSample, setSelectedSample] = useState(null)

	useEffect(() => setModalOpen(true), [])

	const fetchReportData = async () => {
		const start = new Date(startDate)
		const end = new Date(endDate)

		if ((startDate && !endDate) || (!startDate && endDate)) {
			ToastGeneric({ type: 'warning', message: 'Ingresa el rango de fechas.' })
			return
		}

		if (startDate && endDate && start > end) {
			ToastGeneric({ type: 'warning', message: 'La fecha de inicio no puede ser posterior a la fecha de fin' })
			return
		}

		setLoading(true)
		try {
			const response = await getReportRequest(
				startDate,
				endDate,
				search,
				statusReport,
				selectedSample?.id_sample,
				selectedUsers?.id_user
			)
			if (response.status === 200) ToastGeneric({ type: 'success', message: 'Reporte generado exitosamente.' })
			onClose()
		} catch (error) {
			if (error.status === 404) {
				ToastGeneric({ type: 'error', message: 'No se encontrarón resultados.' })
			} else if (error.status === 400) {
				ToastGeneric({ type: 'error', message: 'Solicitud incorrecta. Verifica los parámetros.' })
			} else {
				ToastGeneric({ type: 'error', message: `Error en la generación del reporte: ${error.statusText}` })
			}
		} finally {
			setLoading(false)
		}
	}

	const handleDownload = async () => await fetchReportData()

	const handleResetDates = () => {
		setStartDate('')
		setEndDate('')
	}

	const overlayVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { duration: 0.2, ease: 'easeInOut' },
		},
	}

	const modalVariants = {
		hidden: { opacity: 0, scale: 0.9, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
		visible: {
			opacity: 1,
			scale: 1,
			y: 0,
			transition: { duration: 0.2, ease: 'easeInOut' },
		},
		exit: {
			opacity: 0,
			scale: 1,
			y: 0,
			transition: { duration: 0.2, ease: 'easeIn' },
		},
	}

	const messages = ['Si no se selecciona un rango de fechas, por defecto se toma el mes actual.']

	const {
		loading: loadingSamples,
		error: errorSamples,
		search,
		setSearch,
		handleSearchChange,
		samplesData,
	} = useAllSamplesStore(4)

	const {
		loading: loadingUsers,
		error: errorUsers,
		search: searchUsers,
		setSearch: setSearchUsers,
		handleSearchChange: handleSearchChangeUsers,
		usersData,
	} = useAllUsersStore(2)

	return (
		<AnimatePresence>
			{modalOpen && (
				<motion.div
					className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'
					initial='hidden'
					animate='visible'
					exit='hidden'
					variants={overlayVariants}>
					<motion.div
						className='relative w-full max-w-3xl p-6 space-y-3 rounded-lg bg-white shadow-xl dark:bg-gray-800'
						variants={modalVariants}
						onClick={e => e.stopPropagation()}>
						<div className='flex justify-between items-center'>
							<h3 className='text-xl font-semibold text-slate-600 dark:text-gray-100'>Reporte informes</h3>

							<Button
								variant='none'
								size='small'
								disabled={loading}
								onClick={() => {
									setModalOpen(false)
									setTimeout(onClose, 300)
								}}>
								<LuX size={16} />
							</Button>
						</div>

						<Banner type='info' messages={messages} />

						<div className='space-y-4 text-xs dark:text-gray-300 text-slate-500 pt-4'>
							<div className='grid grid-cols-2 gap-10'>
								<div className='space-y-4 w-full'>
									<div className='flex items-center justify-between w-full gap-4'>
										<div className='w-full'>
											<label htmlFor='startDate' className='block font-medium'>
												Fecha inicio
											</label>
											<input
												type='date'
												id='startDate'
												value={startDate}
												onChange={e => setStartDate(e.target.value)}
												className='mt-2 block w-full p-2 border rounded-lg dark:bg-gray-700 bg-slate-100 dark:border-gray-500 border-slate-300'
											/>
										</div>

										<div className='w-full'>
											<label htmlFor='endDate' className='block font-medium'>
												Fecha fin
											</label>
											<input
												type='date'
												id='endDate'
												value={endDate}
												onChange={e => setEndDate(e.target.value)}
												className='mt-2 block w-full p-2 border rounded-lg dark:bg-gray-700 bg-slate-100 dark:border-gray-500 border-slate-300'
											/>
										</div>
									</div>

									<div className='flex justify-end'>
										<Button onClick={handleResetDates} variant='none' size='small'>
											Restablecer fechas
										</Button>
									</div>
								</div>

								<div className='space-y-5'>
									<div className='space-y-4'>
										<h2 className='text-base font-medium'>Estado de informe</h2>

										{/* Opciones de estado: Emitido (true), No emitido (false) y Todos (null) */}
										<div className='grid grid-cols-3'>
											<label className='flex items-center'>
												<input
													type='radio'
													name='statusReport'
													checked={statusReport === true}
													onChange={() => setStatusReport(true)}
													className='mr-2'
												/>
												Emitido
											</label>
											<label className='flex items-center'>
												<input
													type='radio'
													name='statusReport'
													checked={statusReport === false}
													onChange={() => setStatusReport(false)}
													className='mr-2'
												/>
												No emitido
											</label>
											<label className='flex items-center'>
												<input
													type='radio'
													name='statusReport'
													checked={statusReport === null}
													onChange={() => setStatusReport(null)}
													className='mr-2'
												/>
												Todos
											</label>
										</div>
									</div>
								</div>
							</div>

							<hr className='dark:border-gray-700' />

							<div className='grid grid-cols-2 gap-10'>
								<div className='space-y-4'>
									<h2 className='text-base font-medium'>Muestra</h2>

									<div className='relative group'>
										<input
											type='text'
											placeholder='Buscar...'
											className='p-1.5 pl-8 pr-10 border-2 border-gray-300 rounded-lg bg-white text-gray-700 placeholder-gray-400 font-medium text-sm w-full focus:outline-none focus:ring-transparent focus:ring-slate-500 focus:border-slate-500 dar:focus:ring-gray-500 dark:focus:border-gray-500 dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-500'
											value={search}
											onChange={handleSearchChange}
										/>
										<LuSearch
											className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500'
											size={16}
										/>
										{search && (
											<button
												className='absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-300 hover:dark:bg-gray-500 p-1 rounded'
												onClick={() => setSearch('')}
												title='Resetear búsqueda'>
												<BiX size={16} />
											</button>
										)}
									</div>

									{loadingSamples ? (
										<div className='flex items-center justify-center py-4'>
											<SpinnerLoading />
										</div>
									) : errorSamples ? (
										<Status500 text={errorSamples} />
									) : samplesData?.length === 0 ? (
										<div className='flex justify-center py-4'>
											{!search ? (
												<NotFound icon={<LuArchive size={30} />} title='Sin registros' />
											) : (
												<NotFound icon={<LuSearch size={30} />} title='Sin resultados' />
											)}
										</div>
									) : (
										<>
											{search && (
												<div className='grid grid-cols-1'>
													{samplesData?.map(sample => (
														<label
															key={sample?.id_sample}
															className='p-3 rounded-lg flex flex-col items-start justify-center gap-2 cursor-pointer font-medium uppercase transition-all ease-in-out duration-300 dark:hover:bg-gray-700 dark:bg-gray-700/40 bg-slate-100 my-2'
															onClick={() => {
																setSelectedSample(sample)
																setSearch('')
															}}>
															<input type='radio' value={sample?.id_sample} className='hidden' />
															<div className='flex flex-col gap-1'>
																<span className='break-words line-clamp-2 text-xs'>{sample?.name}</span>
																<span className='break-words line-clamp-1 text-xs'>
																	{sample?.quote?.code || sample?.quote?.access?.code}
																</span>
															</div>
														</label>
													))}
												</div>
											)}

											{selectedSample && (
												<>
													<h2 className='text-sm font-medium'>Muestra seleccionada</h2>
													<div className='mt-4 text-sm flex items-center gap-3 dark:bg-gray-700/30 p-2 rounded-lg'>
														<Button
															onClick={() => setSelectedSample(null)}
															disabled={loading}
															variant='none'
															size='small'>
															<BiX size={18} />
														</Button>
														<div className='flex flex-col gap-1'>
															<span className='break-words line-clamp-2 text-xs'>{selectedSample?.name}</span>
															<span className='break-words line-clamp-1 text-xs'>
																{selectedSample?.quote?.code || selectedSample?.quote?.access?.code}
															</span>
														</div>
													</div>
												</>
											)}
										</>
									)}
								</div>

								<div className='space-y-4'>
									<h2 className='text-base font-medium'>Usuario</h2>

									<div className='relative group'>
										<input
											type='text'
											placeholder='Buscar...'
											className='p-1.5 pl-8 pr-10 border-2 border-gray-300 rounded-lg bg-white text-gray-700 placeholder-gray-400 font-medium text-sm w-full focus:outline-none focus:ring-transparent focus:ring-slate-500 focus:border-slate-500 dar:focus:ring-gray-500 dark:focus:border-gray-500 dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-500'
											value={searchUsers}
											onChange={handleSearchChangeUsers}
										/>
										<LuSearch
											className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500'
											size={16}
										/>
										{searchUsers && (
											<button
												className='absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-300 hover:dark:bg-gray-500 p-1 rounded'
												onClick={() => setSearchUsers('')}
												title='Resetear búsqueda'>
												<BiX size={16} />
											</button>
										)}
									</div>

									{loadingUsers ? (
										<div className='flex items-center justify-center py-4'>
											<SpinnerLoading />
										</div>
									) : errorUsers ? (
										<Status500 text={errorUsers} />
									) : usersData?.length === 0 ? (
										<div className='flex justify-center py-4'>
											{!searchUsers ? (
												<NotFound icon={<LuArchive size={30} />} title='Sin registros' />
											) : (
												<NotFound icon={<LuSearch size={30} />} title='Sin resultados' />
											)}
										</div>
									) : (
										<>
											{searchUsers && (
												<div className='grid grid-cols-1'>
													{usersData?.map(user => (
														<label
															key={user?.id_user}
															className='p-3 rounded-lg flex flex-col items-start justify-center gap-2 cursor-pointer font-medium uppercase transition-all ease-in-out duration-300 dark:hover:bg-gray-700/70'
															onClick={() => {
																setSelectedUsers(user)
																setSearchUsers('')
															}}>
															<input type='radio' value={user?.id_user} className='hidden' />
															<div className='grid grid-cols-1 gap-0.5'>
																<span
																	className={`break-words line-clamp-1 text-xs ${user?.deletedAt ? 'line-through dark:text-red-400' : ''}`}>
																	<strong></strong>
																	{user?.names || '---'}
																</span>
															</div>
														</label>
													))}
												</div>
											)}

											{selectedUsers && (
												<>
													<h2 className='text-sm font-medium'>Analista seleccionado</h2>
													<div className='mt-4 text-sm flex items-center gap-3 dark:bg-gray-700/30 p-2 rounded-lg'>
														<Button
															onClick={() => setSelectedUsers(null)}
															disabled={loadingUsers}
															variant='none'
															size='small'>
															<BiX size={18} />
														</Button>
														<div className='space-y-1 text-xs'>
															<p>{selectedUsers?.names}</p>
														</div>
													</div>
												</>
											)}
										</>
									)}
								</div>
							</div>
						</div>

						<div className='flex justify-end space-x-2 pt-8'>
							<Button
								onClick={() => {
									setModalOpen(false)
									setTimeout(onClose, 200)
								}}
								disabled={loading}
								variant='none'
								size='small'>
								Cancelar
							</Button>

							<Button onClick={handleDownload} variant='primary' size='small' loading={loading}>
								{loading ? 'Generando reporte...' : 'Generar reporte'}
							</Button>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}

export { ReportModal }
