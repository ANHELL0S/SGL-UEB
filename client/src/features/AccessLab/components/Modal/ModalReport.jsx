import { LuArchive, LuSearch, LuX } from 'react-icons/lu'
import { Banner } from '../Banner/Banner'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../../../../components/Button/Button'
import { ToastGeneric } from '../../../../components/Toasts/Toast'
import { useAllUsersStore } from '../../../../hooks/useUser'
import { Status500 } from '../../../../components/Banner/StatusServer'
import { SpinnerLoading } from '../../../../components/Loaders/SpinnerLoading'
import { NotFound } from '../../../../components/Banner/NotFound'
import { BiX } from 'react-icons/bi'
import { SampleService } from '@/services/api/sample.api'
import { saveAs } from 'file-saver'

export const ReportModal = ({ sample, accessData, onClose }) => {
	console.log(accessData)
	const [loading, setLoading] = useState(false)
	const [modalOpen, setModalOpen] = useState(false)
	const [selectedUsers, setSelectedUsers] = useState(null)

	useEffect(() => setModalOpen(true), [])

	const fetchReportData = async () => {
		setLoading(true)
		try {
			// Ajuste: uso de "selectedUsers?.id_user" en lugar de "selectedUsers.id_user"
			const data = {
				user: selectedUsers?.id_user ?? null,
				quote: accessData?.quote?.id_quote,
			}

			ToastGeneric({ type: 'info', message: 'Generando informe Word...' })
			const wordBlob = await SampleService.generateReportDocx(sample?.id_sample, data)
			saveAs(wordBlob, `Informe_muestra - ${sample?.name}.docx`)
			ToastGeneric({ type: 'success', message: 'Informe Word generado correctamente.' })
			onClose()
		} catch (error) {
			ToastGeneric({ type: 'error', message: error.message })
		} finally {
			setLoading(false)
		}
	}

	const handleDownload = async () => await fetchReportData()

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

	const messages = [
		'Cuando generas un informe se crea un código único (Ej: 160-2025), por defecto se marca como "No emitido".',
	]

	// Hook personalizado para la búsqueda de usuarios
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
						className='relative w-full max-w-lg p-6 space-y-3 rounded-lg bg-white shadow-xl dark:bg-gray-800'
						variants={modalVariants}
						onClick={e => e.stopPropagation()}>
						{/* Cabecera del modal */}
						<div className='flex justify-between items-center'>
							<h3 className='text-xl font-semibold text-slate-600 dark:text-gray-100'>Generar informe</h3>

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

						{/* Banner con mensajes */}
						<Banner type='info' messages={messages} />

						<div className='space-y-4 text-xs dark:text-gray-300 text-slate-500 pt-4'>
							<div className='grid grid-cols-1 gap-10'>
								<div className='space-y-2'>
									{/* Etiqueta indicando que es opcional */}
									<h2 className='text-sm font-medium'>Buscar analista colaborador (opcional)</h2>

									{/* Cuadro de búsqueda */}
									<div className='relative group'>
										<input
											type='text'
											placeholder='Buscar...'
											className='p-1.5 pl-8 pr-10 border-2 border-gray-300 rounded-lg bg-white text-gray-700 placeholder-gray-400 font-medium text-sm w-full focus:outline-none focus:ring-transparent focus:ring-slate-500 focus:border-slate-500 dark:focus:ring-gray-500 dark:focus:border-gray-500 dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-500'
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

									{/* Estado de la búsqueda de usuarios */}
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
											{/* Opciones de usuarios (aparecen sólo si hay texto en el buscador) */}
											{searchUsers && (
												<div className='grid grid-cols-1'>
													{usersData?.map(user => (
														<label
															key={user?.id_user}
															className='p-2.5 rounded-lg flex flex-col items-start justify-center cursor-pointer font-medium uppercase transition-all ease-in-out duration-300 dark:hover:bg-gray-700/70'
															onClick={() => {
																setSelectedUsers(user ?? null)
																setSearchUsers('')
															}}>
															<input type='radio' value={user?.id_user} className='hidden' />
															<div className='flex items-center justify-between gap-0.5 w-full'>
																<span
																	className={`break-words line-clamp-1 text-xs ${
																		user?.deletedAt ? 'line-through dark:text-red-400' : ''
																	}`}>
																	{user?.names || '---'}
																</span>
																<span
																	className={`font-semibold px-2 py-0.5 rounded-full ${
																		user?.active
																			? 'dark:text-teal-300 dark:bg-teal-700/50 bg-teal-100 text-teal-500'
																			: 'dark:text-red-300 dark:bg-red-700/50 bg-red-100 text-red-500'
																	}`}>
																	{user?.active ? 'Activo' : 'Inactivo'}
																</span>
															</div>
														</label>
													))}
												</div>
											)}

											{/* Muestra el colaborador seleccionado (si existe) */}
											{selectedUsers && (
												<>
													<h2 className='text-base font-medium pt-4'>Colaborador seleccionado</h2>
													<div className='text-sm flex items-center gap-3 dark:bg-gray-700/40 p-2 rounded-lg'>
														<Button
															onClick={() => setSelectedUsers(null)}
															disabled={loadingUsers}
															variant='none'
															size='small'>
															<BiX size={18} />
														</Button>
														<div className='flex items-center justify-between w-full'>
															<p>{selectedUsers?.names}</p>
															<span
																className={`font-semibold px-2 py-0.5 rounded-full ${
																	selectedUsers?.active
																		? 'dark:text-teal-300 dark:bg-teal-700/50 bg-teal-100 text-teal-500'
																		: 'dark:text-red-300 dark:bg-red-700/50 bg-red-100 text-red-500'
																}`}>
																{selectedUsers?.active ? 'Activo' : 'Inactivo'}
															</span>
														</div>
													</div>
												</>
											)}
										</>
									)}
								</div>
							</div>
						</div>

						{/* Botones de acción */}
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
