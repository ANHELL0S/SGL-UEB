import { BiX } from 'react-icons/bi'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { LuArchive, LuSearch, LuX } from 'react-icons/lu'
import { Button } from '../../../../../components/Button/Button'
import { NotFound } from '../../../../../components/Banner/NotFound'
import { sample_schema_zod } from '../../../validators/sampleValidator'
import { formatISOToDate } from '../../../../../helpers/dateTimeZone.helper'
import { InputFieldZod } from '../../../../../components/Input/InputFieldZod'
import { SpinnerLoading } from '../../../../../components/Loaders/SpinnerLoading'
import { useAllUnitMeasurementStore } from '../../../../../hooks/useUnitMeasurement'
import { TextTareaFieldZod } from '../../../../../components/Input/TextTareaFieldZod'

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

export const SampleForm = ({ text, onSubmit, onClose, onChange, loading, formData }) => {
	const [modalOpen, setModalOpen] = useState(true)

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
		watch,
	} = useForm({
		resolver: zodResolver(sample_schema_zod),
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
		loading: LoadingUnits,
		error: ErrorUnits,
		unitMeasurementData,
		search,
		setSearch,
		handleSearchChange,
	} = useAllUnitMeasurementStore()

	const [selectedunit, setSelectedUnit] = useState(null)
	const handleUnitChange = unit => {
		const isSameUbit = selectedunit?.id_unit_measurement === unit.id_unit_measurement
		const newUnit = isSameUbit ? null : unit
		setSelectedUnit(newUnit)
		setValue('unit_measurement', newUnit ? newUnit.id_unit_measurement : null)
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
									<div className='space-y-4'>
										<h2 className='text-base font-semibold'>General</h2>
										<TextTareaFieldZod
											label='Nombre'
											placeholder='Muestra de orina'
											register={register('name')}
											error={errors.name}
										/>
										<InputFieldZod
											label='Envase'
											placeholder='Tubo de ensayo, Frasco estéril...'
											register={register('container')}
											error={errors.container}
										/>
										<InputFieldZod
											label='Estado'
											placeholder='Sólido, líquido...)'
											register={register('status')}
											error={errors.status}
										/>

										<hr className='dark:border-gray-700' />

										{/* UNIT MEASUREMENT */}
										<div className='space-y-4'>
											<h2 className='text-base font-semibold'>Cantidad y medida</h2>
											<InputFieldZod
												label='Cantidad'
												placeholder='Cantidad'
												register={register('amount')}
												error={errors.amount}
											/>

											<h2 className='text-xs font-medium'>
												Unidad de medida <span className='text-red-500'>*</span>
											</h2>

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
												{LoadingUnits ? (
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
													<>
														{search && (
															<div className='grid grid-cols-1 gap-4'>
																{unitMeasurementData?.map(units => (
																	<div
																		key={units.id_unit_measurement}
																		className='rounded-lg flex flex-col justify-center gap-2 cursor-pointer font-medium transition-all ease-in-out duration-300'>
																		<input
																			type='radio'
																			id={`units-${units.id_unit_measurement}`}
																			value={units.id_unit_measurement}
																			checked={selectedunit?.id_unit_measurement === units.id_unit_measurement}
																			onChange={() => {
																				handleUnitChange(units)
																				setSearch('')
																			}}
																			className='hidden'
																		/>
																		<label
																			htmlFor={`units-${units.id_unit_measurement}`}
																			className={`p-3 rounded-lg flex flex-col justify-center gap-2 cursor-pointer font-medium transition-all ease-in-out duration-300 ${
																				selectedunit?.id_unit_measurement === units.id_unit_measurement
																					? 'dark:bg-gray-700 dark:text-gray-200 bg-slate-200/50'
																					: errors?.units
																						? 'dark:bg-gray-700/40 text-red-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 hover:bg-slate-100/50'
																						: 'dark:bg-gray-700/30 dark:text-gray-300 dark:hover:bg-gray-700/60 hover:bg-slate-100/50'
																			}`}>
																			<div className='flex flex-col gap-2'>
																				<div className='flex items-center justify-between'>
																					<span className='break-words line-clamp-1'>
																						{formatISOToDate(units.createdAt)}
																					</span>
																				</div>
																				<div className='flex items-center justify-between'>
																					<span className='break-words line-clamp-1'>{units.name}</span>
																					<span className='break-words line-clamp-1'>Ud: {units.unit}</span>
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

											{selectedunit ? (
												<>
													<h2 className='text-base font-medium'>Unidad seleccionada</h2>
													<div className='flex flex-col gap-4 mt-2'>
														<motion.div
															key={selectedunit.id_unit_measurement}
															className='pb-1 space-x-3 flex items-center'
															initial={{ opacity: 0, scale: 0.8 }}
															animate={{ opacity: 1, scale: 1 }}
															exit={{ opacity: 0, scale: 0.8 }}>
															<Button
																variant='none'
																size='small'
																disabled={loading}
																onClick={() => handleUnitChange(selectedunit)}>
																<LuX size={16} />
															</Button>

															<div className='flex flex-col gap-2 w-full'>
																<div className='flex items-center justify-between w-full'>
																	<span className='break-words line-clamp-1'>
																		{formatISOToDate(selectedunit.createdAt)}
																	</span>

																	<div className='flex items-center gap-3'></div>
																</div>
																<div className='flex items-center justify-between w-full'>
																	<span className='break-words line-clamp-1'>{selectedunit.name}</span>
																	<span className='break-words line-clamp-1'>Ud: {selectedunit.unit}</span>
																</div>
															</div>
														</motion.div>
													</div>
												</>
											) : (
												<>
													{errors.unit_measurement ? (
														<p className='text-red-500'>{errors.unit_measurement.message}</p>
													) : (
														<p>No has seleccionado ninguna unidad.</p>
													)}
												</>
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
