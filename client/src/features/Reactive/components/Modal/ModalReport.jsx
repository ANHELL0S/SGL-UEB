import { LuArchive, LuSearch, LuX } from 'react-icons/lu'
import { Banner } from '../Banner/Banner'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../../../../components/Button/Button'
import { ToastGeneric } from '../../../../components/Toasts/Toast'
import { useAllReactivesStore } from '../../../../hooks/useReactive'
import { useAllUsersStore } from '../../../../hooks/useUser'
import { getReportRequest } from '../../../../services/api/kardex.api'
import { Status500 } from '../../../../components/Banner/StatusServer'
import { SpinnerLoading } from '../../../../components/Loaders/SpinnerLoading'
import { NotFound } from '../../../../components/Banner/NotFound'
import { BiX } from 'react-icons/bi'

const ReportModal = ({ onClose }) => {
	const [loading, setLoading] = useState(false)
	const [modalOpen, setModalOpen] = useState(false)

	const [endDate, setEndDate] = useState('')
	const [startDate, setStartDate] = useState('')
	const [movementType, setMovementType] = useState('')
	const [control_tracking, setControl_tracking] = useState('')
	const [selectedUsers, setSelectedUsers] = useState(null)
	const [selectedReactive, setSelectedReactive] = useState(null)

	useEffect(() => setModalOpen(true), [])

	const fetchReportData = async () => {
		const start = new Date(startDate)
		const end = new Date(endDate)

		if ((startDate && !endDate) || (!startDate && endDate)) {
			ToastGeneric({ type: 'warning', message: 'Ingresa el rango de fechas.' })
			return
		}

		if (start > end) {
			ToastGeneric({ type: 'warning', message: 'La fecha de inicio no puede ser posterior a la fecha de fin' })
			return
		}

		setLoading(true)
		try {
			const response = await getReportRequest(
				startDate,
				endDate,
				selectedReactive?.id_reactive,
				movementType,
				control_tracking,
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
		loading: loadingReactives,
		error: errorReactives,
		search,
		setSearch,
		handleSearchChange,
		reactivesData,
	} = useAllReactivesStore(2)

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
						className='relative w-full max-w-2xl p-6 space-y-3 rounded-lg bg-white shadow-xl dark:bg-gray-800'
						variants={modalVariants}
						onClick={e => e.stopPropagation()}>
						<div className='flex justify-between items-center'>
							<h3 className='text-xl font-semibold text-slate-600 dark:text-gray-100'>Reporte kardex</h3>

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
								<div className='space-y-4'>
									<div className='grid grid-cols-1 gap-6'>
										<div>
											<label htmlFor='startDate' className='block font-medium'>
												Fecha inicio
											</label>
											<input
												type='date'
												id='startDate'
												value={startDate}
												onChange={e => setStartDate(e.target.value)}
												className='mt-2 block w-full p-2 border rounded-lg dark:bg-gray-700 bg-slate-100 dark:border-gray-500 border-slate-300 '
											/>
										</div>

										<div>
											<label htmlFor='endDate' className='block font-medium'>
												Fecha fin
											</label>
											<input
												type='date'
												id='endDate'
												value={endDate}
												onChange={e => setEndDate(e.target.value)}
												className='mt-2 block w-full p-2 border rounded-lg dark:bg-gray-700 bg-slate-100 dark:border-gray-500 border-slate-300 '
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
									<div className='space-y-3'>
										<h2 className='text-base font-medium'>Tipo movimiento</h2>

										{/* Opciones de tipo de movimiento */}
										<div className='grid grid-cols-2 gap-4'>
											<label className='flex items-center'>
												<input
													type='radio'
													name='movementType'
													value='adjustment'
													checked={movementType === 'adjustment'}
													onChange={e => setMovementType(e.target.value)}
													className='mr-2'
												/>
												Ajuste
											</label>
											<label className='flex items-center'>
												<input
													type='radio'
													name='movementType'
													value='entry'
													checked={movementType === 'entry'}
													onChange={e => setMovementType(e.target.value)}
													className='mr-2'
												/>
												Entrada
											</label>
											<label className='flex items-center'>
												<input
													type='radio'
													name='movementType'
													value='return'
													checked={movementType === 'return'}
													onChange={e => setMovementType(e.target.value)}
													className='mr-2'
												/>
												Salida
											</label>
											<label className='flex items-center'>
												<input
													type='radio'
													name='movementType'
													value='' // void === // all movements
													checked={movementType === ''} // void = all movements
													onChange={e => setMovementType(e.target.value)}
													className='mr-2'
												/>
												Todos
											</label>
										</div>
									</div>

									<div className='space-y-4'>
										<h2 className='text-base font-medium'>Sujeto a fiscalización</h2>

										{/* Opciones de tipo de movimiento */}
										<div className='grid grid-cols-3'>
											<label className='flex items-center'>
												<input
													type='radio'
													name='control_tracking'
													value='si'
													checked={control_tracking === 'si'}
													onChange={e => setControl_tracking(e.target.value)}
													className='mr-2'
												/>
												Si
											</label>
											<label className='flex items-center'>
												<input
													type='radio'
													name='control_tracking'
													value='no'
													checked={control_tracking === 'no'}
													onChange={e => setControl_tracking(e.target.value)}
													className='mr-2'
												/>
												No
											</label>
											<label className='flex items-center'>
												<input
													type='radio'
													name='control_tracking'
													value='' // void === // all movements
													checked={control_tracking === ''} // void = all movements
													onChange={e => setControl_tracking(e.target.value)}
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
									<h2 className='text-base font-medium'>Reactivo</h2>

									<div className='relative group'>
										<input
											type='text'
											placeholder='Buscar...'
											className='p-1.5 pl-8 pr-10 border-2 border-gray-300 rounded-lg bg-white text-gray-700 placeholder-gray-400 font-medium text-sm w-full focus:outline-none focus:ring-transparent focus:ring-slate-500 focus:border-slate-500 dar:focus:ring-gray-500 dark:focus:border-gray-500 dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-500'
											value={search}
											onChange={handleSearchChange}
										/>
										<LuSearch
											className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400  dark:text-gray-500'
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

									{loadingReactives ? (
										<div className='flex items-center justify-center py-4'>
											<SpinnerLoading />
										</div>
									) : errorReactives ? (
										<Status500 text={errorReactives} />
									) : reactivesData?.length === 0 ? (
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
													{reactivesData?.map(reactive => (
														<label
															key={reactive?.id_reactive}
															className='p-3 rounded-lg flex flex-col items-start justify-center gap-2 cursor-pointer font-medium uppercase transition-all ease-in-out duration-300 dark:hover:bg-gray-700/70'
															onClick={() => {
																setSelectedReactive(reactive)
																setSearch('')
															}}>
															<input type='radio' value={reactive?.id_reactive} className='hidden' />
															<div className='grid grid-cols-1 gap-0.5'>
																<span>
																	<strong>Cod:</strong> {reactive?.code}
																</span>

																<span
																	className={`break-words line-clamp-1 text-xs ${reactive?.category?.deletedAt ? 'line-through dark:text-red-400' : ''}`}>
																	<strong></strong>
																	{reactive?.name || '---'}
																</span>
															</div>
														</label>
													))}
												</div>
											)}

											{/* Mostrar el reactivo seleccionado */}
											{selectedReactive && (
												<div className='mt-4 text-sm flex items-center gap-3'>
													<Button
														onClick={() => setSelectedReactive(null)}
														disabled={loading}
														variant='none'
														size='small'>
														<BiX size={18} />
													</Button>
													<div className='space-y-1 text-xs'>
														<p>
															<strong>Cod: </strong>
															{selectedReactive?.code}
														</p>
														<p>{selectedReactive?.name}</p>
													</div>
												</div>
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
											className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400  dark:text-gray-500'
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
											{!search ? (
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

											{/* Mostrar el reactivo seleccionado */}
											{selectedUsers && (
												<div className='mt-4 text-sm flex items-center gap-3'>
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
