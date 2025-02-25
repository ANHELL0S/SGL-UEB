import { LuX } from 'react-icons/lu'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAllRolesStore } from '../../../../hooks/useRole'
import { Button } from '../../../../components/Button/Button'
import { ROLES_ES } from '../../../../helpers/constants.helper'
import { ToastGeneric } from '../../../../components/Toasts/Toast'
import { UserService } from '../../../../services/api/user.api'

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

export const MamageUserRolesForm = ({ onClose, onSuccess, user }) => {
	const [modalOpen, setModalOpen] = useState(false)
	const [loading, setLoading] = useState(false)
	const [selectedRoles, setSelectedRoles] = useState([])
	const { roles, loading: loadingRoles, error: errorRoles } = useAllRolesStore()

	useEffect(() => {
		if (user?.roles) {
			const userRolesIds = user?.roles.map(role => role?.id_rol)
			setSelectedRoles(userRolesIds)
		}
	}, [user])

	const handleRoleChange = role => {
		setSelectedRoles(prev => {
			const updatedRoles = prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
			return updatedRoles
		})
	}

	useEffect(() => setModalOpen(true), [])

	const onSubmit = async e => {
		e.preventDefault()
		setLoading(true)
		try {
			const response = await UserService.managerUserRolesRequest({
				id_user: user.id_user,
				roles: selectedRoles,
			})
			ToastGeneric({ type: 'success', message: response.data.message })
			onClose()
			onSuccess()
		} catch (error) {
			ToastGeneric({ type: 'error', message: error.message })
		} finally {
			setLoading(false)
		}
	}

	return (
		<AnimatePresence>
			{modalOpen && (
				<>
					<motion.div
						className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'
						initial='hidden'
						animate='visible'
						exit='hidden'
						variants={overlayVariants}
					/>
					<motion.div
						className='fixed inset-0 z-50 flex items-center justify-end overflow-auto'
						initial='hidden'
						animate='visible'
						exit='hidden'
						variants={overlayVariants}>
						<motion.div
							className='relative flex h-full w-full max-w-md flex-col gap-y-5 bg-white p-6 text-gray-600 shadow-lg dark:bg-gray-800 dark:text-gray-300'
							variants={modalVariants}
							onClick={e => e.stopPropagation()}>
							<div className='flex items-center justify-between'>
								<h3 className='text-lg font-semibold text-slate-600 dark:text-gray-100'>Administrar roles</h3>
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
								onSubmit={onSubmit}
								className='flex flex-col gap-y-4 pb-20 overflow-y-auto text-xs text-gray-600 dark:text-gray-300 pr-3'>
								<div className='grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-4'>
									{loadingRoles && (
										<div className='col-span-full text-center'>
											<p className='text-gray-500 dark:text-gray-400'>Cargando roles...</p>
										</div>
									)}
									{errorRoles && (
										<div className='col-span-full text-center'>
											<p className='text-red-500 dark:text-red-400'>Error al cargar roles.</p>
										</div>
									)}
									{roles?.data?.map(role => {
										const isSelected = selectedRoles.includes(role?.id_rol)
										return (
											<div
												key={role?.id_rol}
												className={`p-4 rounded-xl flex items-center gap-x-3 cursor-pointer transition  ${
													isSelected
														? 'dark:bg-cyan-100 dark:text-gray-800 bg-gray-300'
														: 'dark:bg-gray-700/40 dark:hover:bg-gray-700 bg-gray-50'
												}`}
												onClick={() => handleRoleChange(role?.id_rol)}>
												<input
													type='checkbox'
													value={role?.id_rol}
													checked={isSelected}
													onChange={() => {}}
													className='hidden'
												/>
												<span className='text-base font-medium'>
													{ROLES_ES[role?.type] || role?.type.replace('_', ' ')}
												</span>
											</div>
										)
									})}
								</div>

								{/*
								<div className='mt-4'>
									<h4 className='font-semibold'>Roles seleccionados:</h4>
									<div className='flex flex-wrap gap-2 mt-2'>
										{selectedRoles?.map(id_rol => {
											const role = roles?.data?.find(r => r?.id_rol === id_rol)
											return (
												<span key={id_rol} className='px-2 py-1 text-xs rounded-lg bg-blue-200 text-blue-800'>
													{ROLES_ES[role?.type] || role?.type.replace('_', ' ')}
												</span>
											)
										})}
									</div>
								</div>
								*/}

								<div className='absolute bottom-0 left-0 flex w-full flex-col justify-end gap-4 bg-white p-6 dark:bg-gray-800 sm:flex-row'>
									<Button
										onClick={() => {
											setModalOpen(false)
											setTimeout(onClose, 300)
										}}
										disabled={loading}
										variant='none'
										size='small'>
										Cancelar
									</Button>
									<Button variant='primary' type='submit' size='small' loading={loading}>
										{loading ? 'Adminitrando roles...' : 'Administrar roles'}
									</Button>
								</div>
							</form>
						</motion.div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	)
}
