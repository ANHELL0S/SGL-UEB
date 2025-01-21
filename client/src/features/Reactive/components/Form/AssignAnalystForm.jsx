import { LuX } from 'react-icons/lu'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { useAllUsersStore } from '../../../../hooks/useUser'
import { Button } from '../../../../components/Button/Button'
import { lab_schema_zod } from '../../validators/labValidator'
import { ToastGeneric } from '../../../../components/Toasts/Toast'
import { createAssignLabAnalystRequest } from '../../../../services/api/lab.api'

export const AssignAnalystForm = ({ onClose, onSuccess, lab }) => {
	const [modalOpen, setModalOpen] = useState(false)
	const [loading, setLoading] = useState(false)
	const [selectedUserId, setSelectedUserId] = useState(null)

	const { users, loading: usersLoading, limit, search, setLimit, setSearch, fetchUsers } = useAllUsersStore()

	const {
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(lab_schema_zod),
		defaultValues: lab,
	})

	useEffect(() => {
		setModalOpen(true)
		fetchUsers()
	}, [limit, search])

	const loadMoreUsers = event => {
		setLimit(parseInt(event?.target?.value, 10))
		setPage(1)
	}

	const onSubmit = async () => {
		if (!selectedUserId) {
			ToastGeneric({ type: 'error', message: 'Por favor selecciona un analista.' })
			return
		}

		setLoading(true)
		try {
			const payload = {
				id_user: selectedUserId,
				id_lab: lab?.id_lab,
			}
			const response = await createAssignLabAnalystRequest(payload)
			ToastGeneric({ type: 'success', message: response.message })
			onClose()
			if (onSuccess) onSuccess()
		} catch (error) {
			ToastGeneric({ type: 'error', message: error.message })
		} finally {
			setLoading(false)
		}
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
						className='relative w-full max-w-md p-6 m-2 space-y-4 rounded-lg bg-white shadow-xl dark:bg-gray-800'
						variants={modalVariants}
						onClick={e => e.stopPropagation()}>
						{/* Encabezado */}
						<div className='flex items-center justify-between'>
							<h3 className='text-lg font-semibold text-slate-600 dark:text-gray-100'>Asignar analista</h3>
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

						<div className='flex items-center gap-4'>
							<select
								id='limit'
								value={limit}
								onChange={loadMoreUsers}
								className='p-1 border border-slate-300 cursor-pointer bg-slate-50 dark:bg-slate-700 dark:border-slate-500 text-sm text-gray-700 dark:text-gray-300 rounded-lg transition ease-in-out duration-300 hover:bg-slate-50 dark:hover:bg-slate-600 w-20 sm:w-auto mt-2 sm:mt-0'>
								<option value={5}>5</option>
								<option value={10}>10</option>
								<option value={50}>50</option>
								<option value={100}>100</option>
							</select>

							<Button onClick={loadMoreUsers} variant='secondary' size='small' disabled={usersLoading}>
								Cargar más analistas
							</Button>
						</div>

						{/* Lista de analistas */}
						<div className='flex flex-col gap-y-2 max-h-80 overflow-y-auto'>
							{usersLoading ? (
								<p>Cargando analistas...</p>
							) : (
								users?.data?.users
									?.filter(user => user.roles.some(role => role.type_rol === 'analyst'))
									.map(user => (
										<div
											key={user.id_user}
											onClick={() => setSelectedUserId(user.id_user)}
											className={`cursor-pointer p-2 rounded-md text-gray-700 dark:text-gray-200 ${
												selectedUserId === user.id_user
													? 'bg-blue-500 text-white'
													: 'hover:bg-gray-200 dark:hover:bg-gray-700'
											}`}>
											{user.names}
										</div>
									))
							)}
						</div>

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
								Cancelar
							</Button>

							<Button variant='primary' onClick={handleSubmit(onSubmit)} size='small' loading={loading}>
								{loading ? 'Asignando...' : 'Asignar analista'}
							</Button>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
