import { useFieldArray, useForm } from 'react-hook-form'
import { useEffect, useRef, useState } from 'react'
import { BiSolidTrash, BiSolidXCircle, BiX } from 'react-icons/bi'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { LuArchive, LuSearch, LuX } from 'react-icons/lu'
import { useAllLabsStore } from '../../../../hooks/useLab'
import { Button } from '../../../../components/Button/Button'
import { useAllQuotesStore } from '../../../../hooks/useQuote'
import { NotFound } from '../../../../components/Banner/NotFound'
import { useAllFacultiesStore } from '../../../../hooks/useFaculty'
import { formatISOToDate } from '../../../../helpers/dateTimeZone.helper'
import { accessLab_schema_zod } from '../../validators/accesslabValidator'
import { InputFieldZod } from '../../../../components/Input/InputFieldZod'
import { SpinnerLoading } from '../../../../components/Loaders/SpinnerLoading'
import { TextTareaFieldZod } from '../../../../components/Input/TextTareaFieldZod'
import { useAllParametersStore } from '@/hooks/useExperiment'

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

export const AccessLabForm = ({ text, onSubmit, onClose, onChange, loading, formData }) => {
	const [modalOpen, setModalOpen] = useState(true)

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
		watch,
		control,
	} = useForm({
		resolver: zodResolver(accessLab_schema_zod),
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

	const { loading: LoadingFaculties, error: ErrorFaculties, faculties } = useAllFacultiesStore()
	const { loading: LoadingLabs, error: ErrorLabs, labData } = useAllLabsStore('all')

	const [selectedFaculty, setSelectedFaculty] = useState('')
	const handleFacultyChange = facultyId => {
		setSelectedFaculty(facultyId)
		setValue('career')
	}

	const [selectedLabs, setSelectedLabs] = useState([])
	const handleLabChange = labId => {
		setSelectedLabs(prev => {
			const updatedLabs = prev.includes(labId) ? prev.filter(id => id !== labId) : [...prev, labId]
			setValue('labs', updatedLabs)
			return updatedLabs
		})
	}

	// ---- Usamos useFieldArray para manejar los aplicantes ----
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'applicant', // debe coincidir con el nombre en defaultValues
	})

	const handleAddApplicant = () => {
		// Agrega un nuevo aplicante con campos vacíos
		append({ name: '', dni: '', email: '' })
	}

	const handleRemoveLastApplicant = () => {
		if (fields.length > 0) {
			remove(fields.length - 1)
		}
	}

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
		if (formData?.labs && Array.isArray(formData.labs)) {
			// Extrae los id de laboratorio de cada objeto
			const preselectedLabs = formData.labs.map(item => item.lab.id_lab)
			setSelectedLabs(preselectedLabs)
			// También puedes sincronizar el valor en react-hook-form
			setValue('labs', preselectedLabs)
		}
	}, [formData?.labs, setValue])

	useEffect(() => {
		if (formData?.faculty?.length) {
			const preselectedFaculty = formData.faculty[0].id_faculty_fk
			setSelectedFaculty(preselectedFaculty)
			setValue('faculty', preselectedFaculty)
		}
		if (formData?.career?.length) {
			const preselectedCareer = formData.career[0].id_career_fk
			setValue('career', preselectedCareer)
		}
	}, [formData, setValue])

	useEffect(() => {
		if (formData?.experiments) {
			const initialSelectedExperiments = formData.experiments.map(item => ({
				...item.experiment,
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
								className='relative flex h-full w-full max-w-xl flex-col gap-y-5 bg-white p-6 text-gray-600 shadow-lg dark:bg-gray-800 dark:text-gray-300'
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
									{/* FACULTAD - CARRERA */}
									<div className='space-y-4'>
										<hr className='dark:border-gray-700' />
										<h2 className='text-base font-semibold'>Facultad</h2>
										<div className='grid grid-cols-1 gap-4'>
											{faculties?.map(faculty => (
												<label
													key={faculty.id_faculty}
													className={`justify-start p-3 rounded-lg flex flex-col gap-2 cursor-pointer font-medium uppercase transition-all ease-in-out duration-300 ${
														errors.faculty
															? 'dark:bg-gray-700/40 text-red-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-all ease-in-out duration-300 hover:bg-slate-100/50 bg-slate-50'
															: watch('faculty') === faculty.id_faculty
																? 'dark:bg-cyan-100 dark:text-gray-800 bg-blue-200/70'
																: 'dark:bg-gray-700/50 dark:text-gray-300 dark:hover:bg-gray-700 hover:bg-slate-100/50'
													}`}
													onClick={() => handleFacultyChange(faculty.id_faculty)}>
													<input type='radio' value={faculty.id_faculty} {...register('faculty')} className='hidden' />

													<span className='break-words line-clamp-1'>{faculty.name}</span>
												</label>
											))}
											{errors.faculty && <p className='text-red-500'>{errors.faculty.message}</p>}
										</div>
									</div>

									<hr className='dark:border-gray-700' />

									{selectedFaculty && (
										<div className='space-y-4'>
											<h2 className='text-base font-semibold'>Carrera</h2>
											<div className='grid grid-cols-2 gap-4'>
												{faculties
													.find(faculty => faculty.id_faculty === selectedFaculty)
													?.carrers?.map(career => (
														<label
															key={career.id_career}
															className={`p-3 rounded-lg flex flex-col items-start gap-2 cursor-pointer font-medium uppercase transition-all ease-in-out duration-300 ${
																errors.career
																	? 'dark:bg-gray-700/40 text-red-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-all ease-in-out duration-300 hover:bg-slate-100/50 bg-slate-50'
																	: watch('career') === career.id_career
																		? 'dark:bg-red-100 dark:text-gray-800 bg-orange-200'
																		: 'dark:bg-gray-700/50 dark:text-gray-300 dark:hover:bg-gray-700'
															}`}>
															<input type='radio' value={career.id_career} {...register('career')} className='hidden' />
															<span className='break-words line-clamp-1'>{career.name}</span>
														</label>
													))}
											</div>
											{errors.career && <p className='text-red-500'>{errors.career.message}</p>}
										</div>
									)}

									{selectedFaculty && <hr className='dark:border-gray-700' />}

									{/* DATOS DE LA INVESTIGACIÓN */}
									<div className='space-y-4'>
										<h2 className='text-base font-semibold'>Datos de la investigación</h2>
										<InputFieldZod
											label='N. resolución aprobación del tema'
											placeholder='N. resolución aprobación del tema'
											register={register('resolution_approval')}
											error={errors.resolution_approval}
										/>
										<InputFieldZod
											label='Motivo de ingreso'
											placeholder='Motivo de ingreso'
											register={register('reason')}
											error={errors.reason}
										/>
										<TextTareaFieldZod
											label='Tema'
											placeholder='Tema'
											register={register('topic')}
											error={errors.topic}
										/>
									</div>

									<hr className='dark:border-gray-700' />

									{/* TIEMPO PERMANENCIA */}
									<div className='space-y-4'>
										<h2 className='text-base font-semibold'>Tiempo permanencia</h2>

										<div className='grid grid-cols-2 gap-4'>
											<InputFieldZod
												type='date'
												label='Fecha ingreso'
												register={register('datePermanenceStart')}
												error={errors.datePermanenceStart}
											/>

											<InputFieldZod
												type='date'
												label='Fecha salida'
												register={register('datePermanenceEnd')}
												error={errors.datePermanenceEnd}
											/>
										</div>
									</div>

									<hr className='dark:border-gray-700' />

									{/* ADSCRIPCIÓN */}
									<div className='space-y-4'>
										<h2 className='text-base font-semibold'>Adscripción</h2>

										<InputFieldZod
											label='Grupo/s'
											placeholder='Grupo/s según RCU-010-2022-138'
											register={register('grupe')}
											error={errors.grupe}
										/>

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
														</label>
													))}
												</div>
											)}
											{errors.labs && <p className='text-red-500'>{errors.labs.message}</p>}
										</div>

										<InputFieldZod
											label='Proyecto de investigación y/o vinculación u otro (adscrito)'
											placeholder='Proyecto de investigación y/o vinculación u otro (adscrito)'
											register={register('attached')}
											error={errors.attached}
										/>

										<div>
											<h2 className='text-xs font-medium'>
												Análisis requeridos <span className='text-red-500'>*</span>
											</h2>

											<div className='relative group pt-2 pb-4'>
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
															<table className='min-w-full table-auto text-xs'>
																<thead>
																	<tr>
																		<th className='px-4 py-2 text-left'></th>
																		<th className='px-4 py-2 text-left'>Parametro</th>
																		<th className='px-4 py-2 text-left'>Categoría</th>
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
																					? 'bg-amber-200 dark:bg-amber-100 text-gray-800 font-medium'
																					: errors?.experiments
																						? 'bg-slate-100/70 text-red-500 dark:bg-gray-700/40 dark:text-red-400 font-medium'
																						: 'dark:text-gray-300 hover:bg-slate-200/40 dark:hover:bg-slate-700/80 border-t dark:border-t-gray-700 font-medium text-slate-600'
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
													<h2 className='text-base font-medium'>
														Análisis seleccionados ({selectedExperiments.length})
													</h2>

													<div className='overflow-x-auto mt-2'>
														<table className='w-full text-xs'>
															<thead>
																<tr className='bg-gray-100 dark:bg-gray-800'>
																	<th className='px-4 py-2 text-left font-medium'>Parametro</th>
																	<th className='px-4 py-2 text-left font-medium'>Categoría</th>
																	<th className='px-4 py-2 text-left font-medium'>Cantidad</th>
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
																			 dark:border-gray-700 rounded-md dark:bg-gray-700 bg-slate-100'
																				/>
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
									</div>

									{/* DIRECTOR */}
									<hr className='dark:border-gray-700' />

									<div className='space-y-4'>
										<h2 className='text-base font-medium'>Director/a</h2>
										<InputFieldZod
											label='Nombres'
											placeholder='Nombres completos'
											register={register('director.name')}
											error={errors.director?.name}
										/>
										<div className='grid grid-cols-12 gap-4'>
											<div className='col-span-4'>
												<InputFieldZod
													label='Cédula'
													placeholder='Cédula'
													register={register('director.dni')}
													error={errors.director?.dni}
												/>
											</div>
											<div className='col-span-8'>
												<InputFieldZod
													label='Correo electrónico'
													placeholder='Correo electrónico'
													register={register('director.email')}
													error={errors.director?.email}
												/>
											</div>
										</div>
									</div>

									<hr className='dark:border-gray-700' />

									{/* APLICANTES */}
									<div className='space-y-4'>
										<h2 className='text-base font-medium'>Aplicantes</h2>
										{fields.map((field, index) => (
											<div key={field.id} className='flex flex-col space-y-3 gap-2 dark:bg-gray-700/40 p-4 rounded-lg'>
												<div className='flex items-center justify-between font-medium'>
													<span>Datos aplicante {index + 1}</span>
													{/* Botón para eliminar el aplicante en esta tarjeta */}
													{fields.length > 1 && (
														<Button
															variant='none'
															size='small'
															disabled={loading}
															iconStart={<BiSolidXCircle />}
															onClick={() => remove(index)}>
															Eliminar
														</Button>
													)}
												</div>
												<InputFieldZod
													label={`Nombres aplicante ${index + 1}`}
													placeholder='Nombres completos'
													register={register(`applicant.${index}.name`)}
													error={errors.applicant?.[index]?.name}
												/>
												<div className='grid grid-cols-12 gap-4'>
													<div className='col-span-4'>
														<InputFieldZod
															label={`Cédula aplicante ${index + 1}`}
															placeholder='Cédula'
															register={register(`applicant.${index}.dni`)}
															error={errors.applicant?.[index]?.dni}
														/>
													</div>
													<div className='col-span-8'>
														<InputFieldZod
															label={`Email aplicante ${index + 1}`}
															placeholder='Correo electrónico'
															register={register(`applicant.${index}.email`)}
															error={errors.applicant?.[index]?.email}
														/>
													</div>
												</div>
											</div>
										))}
										<div className='flex items-center justify-between'>
											<Button variant='secondary' size='small' disabled={loading} onClick={handleAddApplicant}>
												Añadir aplicante
											</Button>
										</div>
									</div>

									<hr className='dark:border-gray-700' />

									<div className='space-y-4'>
										<h2 className='text-base font-semibold'>Otros</h2>
										{/* OBSERVACIONES */}
										<TextTareaFieldZod
											label='Observaciones'
											placeholder='Observaciones'
											register={register('observations')}
											error={errors.observations}
										/>
										{/* CLAUSULAS */}
										<TextTareaFieldZod
											label='Clausulas'
											placeholder='Clausulas'
											register={register('clauses')}
											error={errors.clauses}
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
