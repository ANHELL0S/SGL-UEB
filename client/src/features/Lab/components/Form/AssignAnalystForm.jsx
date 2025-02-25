import { LuArchive, LuSearch, LuX } from 'react-icons/lu'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { useAllUsersStore } from '../../../../hooks/useUser'
import { Button } from '../../../../components/Button/Button'
import { assigned_analyst_lab_schema_zod } from '../../validators/labValidator'
import { ToastGeneric } from '../../../../components/Toasts/Toast'
import { LabService } from '../../../../services/api/lab.api'
import { BiX } from 'react-icons/bi'
import { SpinnerLoading } from '../../../../components/Loaders/SpinnerLoading'
import { NotFound } from '../../../../components/Banner/NotFound'
import { use } from 'react'

const overlayVariants = {
	hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
	visible: { opacity: 1, backdropFilter: 'blur(0px)', transition: { duration: 0.2 } },
}

const modalVariants = {
	hidden: {
		opacity: 0,
		scale: 1,
		x: '100%',
		transition: { duration: 0.2, ease: 'easeInOut' },
	},
	visible: {
		opacity: 1,
		scale: 1,
		x: '0%',
		transition: { duration: 0.2, ease: 'circIn' },
	},
}

export const AssignAnalystForm = ({ text, onSubmit, onClose, onChange, loading, formData }) => {
	const [modalOpen, setModalOpen] = useState(true)

	const {
		users,
		usersData,
		loading: usersLoading,
		error: errorUsers,
		search,
		setSearch,
		handleKeyDown,
		handleSearchChange,
		fetchUsers,
	} = useAllUsersStore()

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
		watch,
	} = useForm({
		resolver: zodResolver(assigned_analyst_lab_schema_zod),
		defaultValues: formData,
	})

	useEffect(() => {
		const subscription = watch((value, { name, type }) => {
			if (type === 'change') {
				onChange({
					target: {
						name,
						value,
					},
				})
			}
		})
		return () => subscription.unsubscribe()
	}, [watch, onChange])

	const [selectedUser, setSelectedUser] = useState(null)
	const handleUserChange = user => {
		const isSameUser = selectedUser?.id_user === user.id_user
		const newSelectedUser = isSameUser ? null : user
		setSelectedUser(newSelectedUser)
		setValue('user', newSelectedUser ? newSelectedUser.id_user : null)
	}

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
						className='fixed inset-0 z-50 flex items-center justify-end overflow-auto'
						initial='hidden'
						animate='visible'
						exit='hidden'
						variants={overlayVariants}>
						<motion.div
							className='relative flex h-full w-full max-w-lg flex-col gap-y-5 bg-white p-6 text-gray-600 shadow-lg dark:bg-gray-800 dark:text-gray-300'
							variants={modalVariants}
							onClick={e => e.stopPropagation()}>
							<div className='flex items-center justify-between'>
								<h3 className='text-lg font-semibold text-slate-600 dark:text-gray-100'>{text?.title}</h3>
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

							<form
								onSubmit={handleSubmit(onSubmit)}
								className='flex flex-col gap-y-4 space-y-4 overflow-y-auto text-xs text-gray-600 dark:text-gray-300'>
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

								<div className='grid grid-cols-1 gap-4'>
									{usersLoading ? (
										<div className='flex items-center justify-center py-4'>
											<SpinnerLoading />
										</div>
									) : usersData?.length === 0 ? (
										<div className='grid grid-cols-1 justify-center py-4 '>
											<NotFound
												icon={!search ? <LuArchive size={40} /> : <LuSearch size={40} />}
												title={!search ? 'Sin registros' : 'Sin resultados'}
											/>
										</div>
									) : (
										<>
											{search && (
												<div className='grid grid-cols-1 gap-3 text-xs'>
													{usersData
														?.filter(users => users.roles?.some(role => role.type_rol === 'analyst'))
														.map(users => (
															<div
																key={users.id_user}
																className='rounded-lg flex flex-col justify-center gap-2 cursor-pointer font-medium transition-all ease-in-out duration-300'>
																<input
																	type='radio'
																	id={`users-${users.id_user}`}
																	value={users.id_user}
																	checked={selectedUser?.id_user === users.id_user}
																	onChange={() => {
																		handleUserChange(users)
																		setSearch('')
																	}}
																	className='hidden'
																/>
																<label
																	htmlFor={`users-${users.id_user}`}
																	className={`p-3 rounded-lg flex flex-col justify-center gap-2 cursor-pointer font-medium transition-all ease-in-out duration-300 ${
																		selectedUser?.id_user === users.id_user
																			? 'dark:bg-gray-700 dark:text-gray-200 bg-slate-200/50'
																			: errors?.users
																				? 'dark:bg-gray-700/40 text-red-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 hover:bg-slate-100/50'
																				: 'dark:bg-gray-700/30 dark:text-gray-300 dark:hover:bg-gray-700/60 hover:bg-slate-100'
																	}`}>
																	<div className='flex flex-col gap-2'>
																		<div className='flex items-center justify-between'>
																			<span className='break-words line-clamp-1'>{users.names}</span>
																			<div className='flex items-center gap-2'>
																				<span
																					className={`font-semibold px-2 py-0.5 rounded-full ${
																						users?.active
																							? 'dark:text-emerald-300 text-emerald-500'
																							: 'dark:text-red-300 text-red-500'
																					}`}>
																					{users?.active ? 'Activo' : 'Inactivo'}
																				</span>
																			</div>
																		</div>
																	</div>
																</label>
															</div>
														))}
												</div>
											)}
										</>
									)}
								</div>

								{selectedUser ? (
									<>
										<h2 className='text-base font-medium'>Análista seleccionado</h2>
										<div className='flex flex-col gap-4 mt-2'>
											<motion.div
												key={selectedUser.id_user}
												className='pb-1 space-x-3 flex items-center'
												initial={{ opacity: 0, scale: 0.8 }}
												animate={{ opacity: 1, scale: 1 }}
												exit={{ opacity: 0, scale: 0.8 }}>
												<Button
													variant='none'
													size='small'
													disabled={loading}
													onClick={() => handleUserChange(selectedUser)}>
													<LuX size={16} />
												</Button>

												<div className='flex flex-col gap-2 w-full'>
													<div className='flex items-center justify-between'>
														<span className='break-words line-clamp-1'>{selectedUser.names}</span>
														<div className='flex items-center gap-2'>
															<span
																className={`font-semibold px-2 py-0.5 rounded-full ${
																	selectedUser?.active
																		? 'dark:text-emerald-300 text-emerald-500'
																		: 'dark:text-red-300 text-red-500'
																}`}>
																{selectedUser?.active ? 'Activo' : 'Inactivo'}
															</span>
														</div>
													</div>
												</div>
											</motion.div>
										</div>
									</>
								) : (
									<div className='text-sm font-medium'>
										{errors.user ? (
											<p className='text-red-500'>{errors.user.message}</p>
										) : (
											<p>No has seleccionado ninguna análista.</p>
										)}
									</div>
								)}

								<div className='absolute bottom-0 left-0 rounded-lg flex w-full flex-col justify-end gap-4 bg-white p-6 text-xs font-semibold dark:bg-gray-800 sm:flex-row'>
									<Button
										onClick={() => {
											setModalOpen(false)
											setTimeout(onClose, 300)
										}}
										disabled={loading}
										variant='none'
										type='button'
										size='small'>
										{text.buttonCancel}
									</Button>

									<Button variant='primary' type='submit' size='small' loading={loading}>
										{loading ? text.buttonLoading : text.buttonSubmit}
									</Button>
								</div>
							</form>
						</motion.div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
