import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { LuArchive, LuSearch, LuX } from 'react-icons/lu'
import { Button } from '../../../../components/Button/Button'
import { InputFieldZod } from '../../../../components/Input/InputFieldZod'
import { quote_schema_zod } from '../../validators/quoteValidator'
import { SpinnerLoading } from '../../../../components/Loaders/SpinnerLoading'
import { BiX, BiSolidTrash } from 'react-icons/bi'
import { useAllParametersStore } from '../../../../hooks/useExperiment'
import { NotFound } from '../../../../components/Banner/NotFound'
import { Status500 } from '../../../../components/Banner/StatusServer'

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

export const QuoteForm = ({ text, onSubmit, onClose, onChange, loading, formData }) => {
	const [modalOpen, setModalOpen] = useState(true)

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
		watch,
	} = useForm({
		resolver: zodResolver(quote_schema_zod),
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
		loading: loadingExperiments,
		error: errorloadingExperiments,
		search,
		setSearch,
		handleKeyDown,
		handleSearchChange,
		experimentsData,
	} = useAllParametersStore()

	const [selectedExperiments, setSelectedExperiments] = useState([])
	const [quantities, setQuantities] = useState({})

	useEffect(() => {
		if (formData?.experiments) {
			const initialSelectedExperiments = formData.experiments.map(item => ({
				// Aquí esparces las propiedades del experimento
				...item.experiment,
				// y usas el amount que viene en 'item'
				amount: item.experiment.amount ?? 1,
			}))

			setSelectedExperiments(initialSelectedExperiments)

			const initialQuantities = initialSelectedExperiments.reduce((acc, exp) => {
				acc[exp.id_experiment_parameter] = exp.amount
				return acc
			}, {})

			setQuantities(initialQuantities)

			// Si usas react-hook-form, sincroniza también
			setValue(
				'experiments',
				initialSelectedExperiments.map(exp => ({
					id: exp.id_experiment_parameter,
					amount: exp.amount,
				}))
			)
		}
	}, [formData?.experiments, setValue])

	// BY OPEN AI
	const handleExperimentChange = experiment => {
		const expId = experiment.id_experiment_parameter

		setSelectedExperiments(prev => {
			const experimentExists = prev.some(e => e.id_experiment_parameter === expId)

			let updatedExperiments

			if (experimentExists) {
				// Si ya existe, lo quitamos (toggle off)
				updatedExperiments = prev.filter(e => e.id_experiment_parameter !== expId)
			} else {
				// Si NO existe, lo añadimos (toggle on)
				// Preserva la cantidad si ya está en quantities,
				// si no, usa experiment.amount, si tampoco existe -> 1
				const newQty = quantities[expId] ?? experiment.amount ?? 1

				updatedExperiments = [
					...prev,
					{
						...experiment,
						amount: newQty,
					},
				]
			}

			// Actualiza el valor de "experiments" en react-hook-form con
			// el mismo triple fallback para cada item.
			setValue(
				'experiments',
				updatedExperiments.map(exp => ({
					id: exp.id_experiment_parameter,
					amount: quantities[exp.id_experiment_parameter] ?? exp.amount ?? 1,
				}))
			)

			return updatedExperiments
		})
	}

	const handleQuantityChange = (id, value) => {
		// 1. Si el input está vacío, permite al usuario limpiar el campo
		//    para volver a escribir sin setear nada aún en react-hook-form:
		if (value === '') {
			setQuantities(prev => ({
				...prev,
				[id]: '',
			}))
			return
		}

		// 2. Si no está vacío, parseamos como entero y forzamos que sea mínimo 1
		let parsedValue = parseInt(value, 10)
		if (isNaN(parsedValue) || parsedValue < 1) {
			parsedValue = 1
		}

		// 3. Actualizamos el estado local 'quantities'
		setQuantities(prev => ({
			...prev,
			[id]: parsedValue,
		}))

		// 4. Actualizamos react-hook-form solo con valores numéricos (>=1).
		//    Observa el fallback para cada experimento, para no pisar
		//    un valor previo que se haya cargado
		setValue(
			'experiments',
			selectedExperiments.map(exp => ({
				id: exp.id_experiment_parameter,
				amount:
					exp.id_experiment_parameter === id
						? parsedValue
						: // Si no es el que cambió, toma lo que hay en quantities o en exp.amount
							quantities[exp.id_experiment_parameter] ?? exp.amount ?? 1,
			}))
		)
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
								className='relative flex h-full w-full max-w-3xl flex-col gap-y-5 bg-white p-6 text-gray-600 shadow-lg dark:bg-gray-800 dark:text-gray-300'
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
										<hr className='dark:border-gray-700' />
										<h2 className='text-base font-semibold'>Datos de la muestra</h2>
										<div className='grid grid-cols-2 gap-4'>
											<InputFieldZod
												label='Tipo de muestra'
												placeholder='Sanguínea, Urinaria...'
												register={register('type_sample')}
												error={errors.type_sample}
											/>
											<InputFieldZod
												label='Numero de muestras'
												placeholder='3'
												register={register('amount_sample')}
												error={errors.amount_sample}
											/>
										</div>

										<InputFieldZod
											label='Detalle'
											placeholder='Observaciones adicionales, notas, etc.'
											register={register('detail_sample')}
											error={errors.detail_sample}
										/>

										<hr className='dark:border-gray-700' />

										<h2 className='text-base font-semibold'>Análisis</h2>

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

										{loadingExperiments ? (
											<div className='flex items-center justify-center py-4'>
												<SpinnerLoading />
											</div>
										) : errorloadingExperiments ? (
											<Status500 text={errorloadingExperiments} />
										) : experimentsData?.length === 0 ? (
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
													<div className='overflow-x-auto'>
														<table className='min-w-full table-auto'>
															<thead>
																<tr>
																	<th className='px-4 py-2 text-left'></th>
																	<th className='px-4 py-2 text-left'>Parametro</th>
																	<th className='px-4 py-2 text-left'>Categoría</th>
																	<th className='px-4 py-2 text-left'>Precio (USD)</th>
																</tr>
															</thead>
															<tbody>
																{experimentsData?.map(experiment => (
																	<tr
																		key={experiment?.id_experiment_parameter}
																		className={`${
																			selectedExperiments.some(
																				e => e?.id_experiment_parameter === experiment?.id_experiment_parameter
																			)
																				? 'bg-amber-200 dark:bg-amber-100 text-slate-600 font-medium'
																				: errors?.experiments
																					? 'bg-slate-100/70 text-red-500 dark:bg-gray-700/40 dark:text-red-400 font-medium'
																					: 'dark:text-gray-300 text-slate-600 hover:bg-slate-200/40 dark:hover:bg-slate-700/80 border-t dark:border-t-gray-700 font-medium '
																		}`}>
																		<td className='px-4 py-2'>
																			<input
																				type='checkbox'
																				value={experiment?.id_experiment_parameter}
																				checked={selectedExperiments.some(
																					e => e?.id_experiment_parameter === experiment?.id_experiment_parameter
																				)}
																				onChange={() => {
																					handleExperimentChange(experiment)
																					setSearch('')
																				}}
																				className='form-checkbox h-4 w-4 cursor-pointer'
																			/>
																		</td>
																		<td className='px-4 py-2'>{experiment?.name}</td>
																		<td className='px-4 py-2'>
																			<span
																				className={`${experiment?.category?.deletedAt ? 'line-through text-red-400' : ''}`}>
																				{experiment?.category?.name || '---'}
																			</span>
																		</td>
																		<td className='px-4 py-2 font-semibold'>{experiment?.public_price}</td>
																	</tr>
																))}
															</tbody>
														</table>
													</div>
												)}
											</>
										)}
									</div>

									<div>
										{selectedExperiments.length > 0 ? (
											<>
												<h2 className='text-base font-medium'>Análisis seleccionados ({selectedExperiments.length})</h2>

												<div className='overflow-x-auto mt-2'>
													<table className='w-full text-xs'>
														<thead>
															<tr className='bg-gray-100 dark:bg-gray-800'>
																<th className='px-4 py-2 text-left font-medium'>Parametro</th>
																<th className='px-4 py-2 text-left font-medium'>Categoría</th>
																<th className='px-4 py-2 text-left font-medium'>Cantidad</th>
																<th className='px-4 py-2 text-left font-medium'>Costo unt</th>
																<th className='px-4 py-2 text-left font-medium'>Costo total</th>
																<th className='px-4 py-2 text-left font-medium'>Acción</th>
															</tr>
														</thead>
														<tbody>
															{selectedExperiments.map(experiment => {
																// 1) Fallback: primero verifica si en quantities hay un valor,
																//    si no, usa experiment.amount (viene precargado),
																//    y si tampoco existe, entonces pone 1.
																const currentQty =
																	quantities[experiment?.id_experiment_parameter] ?? experiment?.amount ?? 1

																return (
																	<motion.tr
																		key={experiment?.id_experiment_parameter}
																		initial={{ opacity: 0, scale: 0.9 }}
																		animate={{ opacity: 1, scale: 1 }}
																		exit={{ opacity: 0, scale: 0.9 }}
																		className='border-t border-gray-300 dark:border-gray-700'>
																		<td className='px-4 py-2 break-words'>
																			<span className={experiment?.deletedAt ? 'line-through text-red-500' : ''}>
																				{experiment?.name}
																			</span>
																		</td>

																		<td className='px-4 py-2 break-words'>{experiment?.category?.name}</td>

																		<td className='px-4 py-2 text-center'>
																			<input
																				type='number'
																				min='1'
																				value={currentQty}
																				onChange={e =>
																					handleQuantityChange(experiment?.id_experiment_parameter, e.target.value)
																				}
																				className='hide-number-controls w-16 px-2 py-1 border 
                                 dark:border-gray-700 rounded-md bg-slate-100 dark:bg-gray-700'
																			/>
																		</td>

																		<td className='px-4 py-2 break-words'>
																			{/* parse public_price a número si viene como string */}
																			{experiment?.public_price}
																		</td>

																		<td className='px-4 py-2 break-words'>
																			{(Number(experiment?.public_price) * currentQty).toFixed(2)}
																		</td>

																		<td className='px-4 py-2 text-center'>
																			<Button
																				variant='none'
																				size='small'
																				disabled={loading}
																				onClick={() => handleExperimentChange(experiment)}>
																				<BiSolidTrash size={14} className='text-red-400' />
																			</Button>
																		</td>
																	</motion.tr>
																)
															})}
														</tbody>
													</table>
												</div>
											</>
										) : (
											<>
												{errors.experiments ? (
													<p className='text-red-500'>{errors.experiments.message}</p>
												) : (
													<p>No has seleccionado ningún análisis.</p>
												)}
											</>
										)}
									</div>

									<hr className='dark:border-gray-700' />

									{/* DATOS DEl SOLICITANTE */}
									<div className='space-y-4'>
										<h2 className='text-base font-medium'>Datos personales</h2>
										<div className='grid grid-cols-2 gap-4'>
											<InputFieldZod
												label='Nombres - Apellidos'
												placeholder='Nombres completos del solicitante'
												register={register('name')}
												error={errors.name}
											/>
											<InputFieldZod
												label='Email'
												placeholder='Email'
												register={register('email')}
												error={errors.email}
											/>
										</div>
										<div className='grid grid-cols-2 gap-4'>
											<InputFieldZod
												label='Cédula'
												placeholder='1234567890'
												register={register('dni')}
												error={errors.dni}
											/>

											<InputFieldZod
												label='Telefono'
												placeholder='Telefono'
												register={register('phone')}
												error={errors.phone}
											/>
										</div>

										<InputFieldZod
											label='Dirección'
											placeholder='Dirección'
											register={register('direction')}
											error={errors.direction}
										/>
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
