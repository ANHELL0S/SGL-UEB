import { LuX } from 'react-icons/lu'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { user_zod } from '../../validators/UserValidator'
import { Button } from '../../../../components/Button/Button'
import { InputFieldZod } from '../../../../components/Input/InputFieldZod'

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

export const UserForm = ({ text, onSubmit, onClose, onChange, loading, formData }) => {
	const [modalOpen, setModalOpen] = useState(true)

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		watch,
	} = useForm({
		resolver: zodResolver(user_zod),
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

	return (
		<>
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
									<h1 className='text-xl font-semibold text-slate-600 dark:text-gray-100'>{text?.title}</h1>

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

								{text.info && (
									<div className='grid grid-cols-1 gap-x-4 gap-y-3 font-medium'>
										<div className='text-xs flex flex-col gap-y-1 font-semibold text-sky-500'>
											<div className='flex flex-col gap-y-2 border-l-4 border-sky-500 bg-sky-50 p-2 font-normal dark:border-sky-700 dark:bg-sky-900/50'>
												<span>{text?.info}</span>
											</div>
										</div>
									</div>
								)}

								<form
									onSubmit={handleSubmit(onSubmit)}
									className='flex flex-col gap-y-4 pb-20 overflow-y-auto text-xs text-gray-600 dark:text-gray-300 pr-3'>
									<InputFieldZod
										label='Nombres'
										placeholder='Ingrese los nombres'
										register={register('names')}
										error={errors.names}
									/>

									<InputFieldZod
										label='E-mail'
										placeholder='Ingrese el correo electrónico'
										type='email'
										register={register('email')}
										error={errors.email}
									/>

									<InputFieldZod
										label='Teléfono'
										placeholder='Ingrese el teléfono'
										type='text'
										register={register('phone')}
										error={errors.phone}
									/>
									<InputFieldZod
										label='Cédula'
										placeholder='Ingrese la cédula'
										type='text'
										register={register('dni')}
										error={errors.dni}
									/>
									<InputFieldZod
										label='Código'
										placeholder='Ingrese el código'
										type='text'
										register={register('code')}
										error={errors.code}
									/>

									<div className='absolute bottom-0 left-0 rounded-lg flex w-full flex-col justify-end gap-4 bg-white p-6 text-xs font-semibold dark:bg-gray-800 sm:flex-row'>
										<Button
											disabled={loading}
											onClick={() => {
												setModalOpen(false)
												setTimeout(onClose, 300)
											}}
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
					</>
				)}
			</AnimatePresence>
		</>
	)
}
