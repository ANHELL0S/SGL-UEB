import { useForm } from 'react-hook-form'
import { useEffect, useRef, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { LuArchive, LuLock, LuSearch, LuX } from 'react-icons/lu'
import { Button } from '../../../../components/Button/Button'
import { InputFieldZod } from '../../../../components/Input/InputFieldZod'
import { reactive_schema_zod } from '../../validators/ReactiveValidator'
import { SpinnerLoading } from '../../../../components/Loaders/SpinnerLoading'
import { TextTareaFieldZod } from '../../../../components/Input/TextTareaFieldZod'
import {
	BiSolidFace,
	BiSolidFaceMask,
	BiSolidXCircle,
	BiInfoCircle,
	BiX,
	BiSolidCheckShield,
	BiSolidShieldX,
} from 'react-icons/bi'
import { useAllLabsStore } from '../../../../hooks/useLab'
import { useAllUnitMeasurementStore } from '../../../../hooks/useUnitMeasurement'
import { NotFound } from '../../../../components/Banner/NotFound'
import { SelectFieldZod } from '../../../../components/Input/SelectFieldZod'

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

export const ReactiveForm = ({ text, onSubmit, onClose, onChange, loading, formData }) => {
	const [modalOpen, setModalOpen] = useState(true)

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm({
		resolver: zodResolver(reactive_schema_zod),
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

	const {
		loading: loadingUnitMeasurement,
		error,
		page,
		limit,
		search,
		setSearch,
		fetchUnitMeasurementData,
		handleKeyDown,
		handleSearchChange,
		handleLimitChange,
		handlePageChange,
		totalRecords,
		totalPages,
		unitMeasurementData,
	} = useAllUnitMeasurementStore(6)

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
									<div className='grid grid-cols-2 gap-4'>
										<InputFieldZod
											label='Nombre'
											placeholder='Nombre del reactivo'
											register={register('name')}
											error={errors.name}
										/>
										<InputFieldZod
											label='Código'
											placeholder='Código del reactivo'
											register={register('code')}
											error={errors.code}
										/>
									</div>
									<hr className='dark:border-gray-700' />
									{/* UNIDAD DE MEDIDA */}
									<div className='space-y-4'>
										<h2 className='text-base font-medium'>Unidad de medida</h2>
										<div className='relative group'>
											<input
												type='text'
												placeholder='Buscar...'
												className='p-1.5 pl-8 pr-10 border-2 border-gray-300 rounded-lg bg-white text-gray-700 placeholder-gray-400 font-medium text-sm w-full focus:outline-none focus:ring-transparent focus:ring-slate-500 focus:border-slate-500 dar:focus:ring-gray-500 dark:focus:border-gray-500 dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-500'
												value={search}
												onChange={handleSearchChange}
												onKeyDown={handleKeyDown}
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

										<div className='grid grid-cols-2 gap-4'>
											{loadingUnitMeasurement ? (
												<div className='flex items-center justify-center py-4'>
													<SpinnerLoading />
												</div>
											) : unitMeasurementData?.length === 0 ? (
												<div className='grid grid-cols-1 justify-center py-4 '>
													<NotFound
														icon={!search ? <LuArchive size={40} /> : <LuSearch size={40} />}
														title={!search ? 'Sin registros' : 'Sin resultados'}
													/>
												</div>
											) : (
												unitMeasurementData?.map(unit => (
													<label
														key={unit.id_unit_measurement}
														className={`justify-start p-3 rounded-lg flex flex-col gap-2 cursor-pointer font-medium uppercase transition-all ease-in-out duration-300 ${
															errors.unit
																? 'dark:bg-gray-700/40 bg-slate-50 text-red-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-all ease-in-out duration-300 hover:bg-slate-100'
																: watch('unit') === unit.id_unit_measurement
																	? 'dark:bg-cyan-100 dark:text-gray-800 bg-slate-200'
																	: 'dark:bg-gray-700/50 dark:text-gray-300 dark:hover:bg-gray-700 hover:bg-slate-100'
														}`}>
														<input
															type='radio'
															value={unit.id_unit_measurement}
															{...register('unit')}
															className='hidden'
														/>

														<div className='flex justify-between items-center'>
															<span className='break-words line-clamp-1'>{unit.name}</span>
															<span className='break-words line-clamp-1 lowercase'>{unit.unit}</span>
														</div>
													</label>
												))
											)}
											{errors.unit && <p className='text-red-500'>{errors.unit.message}</p>}
										</div>
									</div>

									<hr className='dark:border-gray-700' />

									<div className='space-y-4'>
										<h2 className='text-base font-medium'>Cantidades</h2>
										<div className='grid grid-cols-2 gap-4'>
											<InputFieldZod
												label='Número de envases'
												placeholder='Número de envases'
												register={register('number_of_containers')}
												error={errors.number_of_containers}
											/>
											<InputFieldZod
												label='Cantidad'
												placeholder='Cantidad'
												register={register('current_quantity')}
												error={errors.current_quantity}
											/>
										</div>
									</div>

									<hr className='dark:border-gray-700' />

									{/* OTROS */}
									<div className='space-y-4'>
										<h2 className='text-base font-medium'>Otros detalles</h2>
										<div className='grid md:grid-cols-2 gap-4'>
											<InputFieldZod
												label='CAS'
												placeholder='CAS'
												register={register('cas')}
												error={errors.cas}
												required={false}
											/>
											<InputFieldZod
												type='date'
												label='Fecha de expiración'
												placeholder='Fecha de expiración'
												register={register('expiration_date')}
												error={errors.expiration_date}
												required={false}
											/>
										</div>
									</div>

									{/* CONTROLADO */}
									<div className='space-y-4'>
										<h2 className='text-base font-medium'>Sujeto a fiscalización</h2>
										<div className='grid grid-cols-2 gap-4'>
											{[
												{
													value: 'si',
													label: 'Si',
													icon: <BiSolidCheckShield size={32} />,
												},
												{
													value: 'no',
													label: 'No',
													icon: <BiSolidShieldX size={32} />,
												},
											].map(option => (
												<label
													key={option.value}
													className={`p-4 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer font-medium uppercase transition-all ease-in-out duration-300 ${
														errors.control_tracking
															? 'dark:bg-gray-700/40 dark:text-red-400 dark:hover:bg-gray-700 dark:hover:text-gray-300'
															: watch('control_tracking') === option.value
																? option.value === 'si'
																	? 'bg-emerald-200 text-gray-800'
																	: 'bg-red-200 text-gray-800'
																: 'dark:bg-gray-700/50 dark:text-gray-300 dark:hover:bg-gray-700 bg-slate-100 hover:bg-slate-200/70'
													}`}>
													<input
														type='radio'
														value={option.value}
														{...register('control_tracking')}
														className='hidden'
													/>
													<div>{option.icon}</div>
													<span>{option.label}</span>
												</label>
											))}

											{errors.control_tracking && (
												<div className='text-red-500 text-xs flex items-start gap-1 font-normal'>
													<BiInfoCircle size={16} /> <p>{errors.control_tracking.message}</p>
												</div>
											)}
										</div>
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
