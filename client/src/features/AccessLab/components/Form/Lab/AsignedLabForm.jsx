import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { LuArchive, LuSearch, LuX } from 'react-icons/lu'
import { Button } from '../../../../../components/Button/Button'
import { InputFieldZod } from '../../../../../components/Input/InputFieldZod'
import { asignedLab_schema_zod } from '../../../validators/asignedLabValidator'
import { SpinnerLoading } from '../../../../../components/Loaders/SpinnerLoading'
import { BiX, BiSolidTrash, BiSolidUser } from 'react-icons/bi'
import { useAllParametersStore } from '../../../../../hooks/useExperiment'
import { NotFound } from '../../../../../components/Banner/NotFound'
import { Status500 } from '../../../../../components/Banner/StatusServer'
import { useAllLabsStore } from '../../../../../hooks/useLab'

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

export const LabForm = ({ text, onSubmit, onClose, onChange, loading, formData }) => {
	console.log(formData)
	const [modalOpen, setModalOpen] = useState(true)

	// Corregido: mapear directamente sobre formData.labs
	const initialLabs =
		formData?.labs?.map(item => ({
			id: item.lab?.id_lab,
		})) ?? []

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
		watch,
	} = useForm({
		resolver: zodResolver(asignedLab_schema_zod),
		defaultValues: {
			labs: initialLabs,
		},
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

	// ASIGNED LAB
	const { loading: LoadingLabs, error: ErrorLabs, labData } = useAllLabsStore('all')

	const [selectedLabs, setSelectedLabs] = useState(() => {
		return initialLabs.map(l => l.id)
	})

	// Manejo de click en cada lab
	const handleLabChange = labId => {
		setSelectedLabs(prevSelected => {
			let updatedLabs
			if (prevSelected.includes(labId)) {
				updatedLabs = prevSelected.filter(id => id !== labId)
			} else {
				updatedLabs = [...prevSelected, labId]
			}

			setValue(
				'labs',
				updatedLabs.map(id => ({ id }))
			)
			return updatedLabs
		})
	}

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
								className='relative flex h-full w-full max-w-lg flex-col gap-y-5 bg-white p-6 text-gray-600 shadow-lg dark:bg-gray-800 dark:text-gray-300'
								variants={modalVariants}
								onClick={e => e.stopPropagation()}>
								<div className='flex items-center justify-between'>
									<h3 className='text-xl font-semibold text-slate-600 dark:text-gray-100'>{text?.title}</h3>

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
									className='flex flex-col gap-y-4 pb-20 space-y-4 overflow-y-auto text-xs text-gray-600 dark:text-gray-300'>
									<div className='space-y-2'>
										<h2 className='text-xs font-medium'>Escoje los laboratorios</h2>
										{LoadingLabs ? (
											<p>Cargando laboratorios...</p>
										) : ErrorLabs ? (
											<p className='text-red-500'>Error al cargar los laboratorios</p>
										) : (
											<div className='grid grid-cols-1 gap-4'>
												{labData?.map(lab => (
													<label
														key={lab.id_lab}
														className={`p-3 rounded-lg flex flex-col items-start justify-center gap-2 cursor-pointer font-medium uppercase transition-all ease-in-out duration-300 ${
															selectedLabs.includes(lab.id_lab)
																? 'dark:bg-amber-100 dark:text-gray-800 bg-amber-200 text-gray-800'
																: errors?.labs
																	? 'dark:bg-gray-700/40 bg-slate-100/70 text-red-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 hover:bg-slate-100'
																	: 'dark:bg-gray-700/50 dark:text-gray-300 dark:hover:bg-gray-700 hover:bg-slate-100'
														}`}
														onClick={() => handleLabChange(lab.id_lab)}>
														<input
															type='checkbox'
															value={lab.id_lab}
															checked={selectedLabs.includes(lab.id_lab)}
															onChange={() => handleLabChange(lab.id_lab)}
															className='hidden'
														/>
														<span>{lab.name}</span>
														<div className='flex items-center gap-1'>
															<BiSolidUser />
															<span>{lab.analysts}</span>
														</div>
													</label>
												))}
											</div>
										)}
										{errors.labs && <p className='text-red-500'>{errors.labs.message}</p>}
									</div>

									<div className='absolute bottom-0 left-0 rounded-xl flex w-full flex-col justify-end gap-4 bg-white p-6 text-xs font-semibold dark:bg-gray-800 sm:flex-row'>
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
