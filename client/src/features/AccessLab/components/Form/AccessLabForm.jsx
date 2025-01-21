import { useForm } from 'react-hook-form'
import { useEffect, useRef, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { LuLock, LuX } from 'react-icons/lu'
import { Button } from '../../../../components/Button/Button'
import { InputFieldZod } from '../../../../components/Input/InputFieldZod'
import { accessLab_schema_zod } from '../../validators/accesslabValidator'
import { SpinnerLoading } from '../../../../components/Loaders/SpinnerLoading'
import { TextTareaFieldZod } from '../../../../components/Input/TextTareaFieldZod'
import { BiSolidFace, BiSolidFaceMask, BiSolidXCircle, BiInfoCircle } from 'react-icons/bi'
import { useAllLabsStore } from '../../../../hooks/useLab'
import { useAllFacultiesStore } from '../../../../hooks/useFaculty'
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

export const AccessLabForm = ({ text, onSubmit, onClose, onChange, loading, formData }) => {
	const [modalOpen, setModalOpen] = useState(true)

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
		watch,
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
		setValue('career', '')
	}

	const [applicants, setApplicants] = useState(formData.applicant)
	const handleAddApplicant = () => {
		const updatedApplicants = [...applicants, { name: '', dni: '', email: '' }]
		setApplicants(updatedApplicants)
		reset({ applicants: updatedApplicants })
	}
	const handleRemoveLastApplicant = () => {
		if (applicants.length > 0) {
			const updatedApplicants = applicants.slice(0, -1)
			setApplicants(updatedApplicants)
			reset({ applicants: updatedApplicants })
		}
	}

	const [selectedLabs, setSelectedLabs] = useState([])
	const handleLabChange = labId => {
		setSelectedLabs(prev => {
			const updatedLabs = prev.includes(labId) ? prev.filter(id => id !== labId) : [...prev, labId]
			setValue('labs', updatedLabs)
			return updatedLabs
		})
	}

	const typeAccess = watch('type_access')
	const previousTypeAccess = useRef(typeAccess)
	useEffect(() => {
		// Verifica si el valor de type_access ha cambiado
		if (typeAccess !== previousTypeAccess.current) {
			previousTypeAccess.current = typeAccess
			reset({
				...formData,
				type_access: typeAccess,
				faculty: '',
				career: '',
				reason: '',
				topic: '',
				startTime: '',
				endTime: '',
				director: { name: '', dni: '', email: '' },
				applicant: [{ name: '', dni: '', email: '' }],
				labs: [],
				observations: '',
			})
		}
	}, [typeAccess, reset, formData])

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
							className='fixed inset-0 m-4 z-50 flex items-center justify-end overflow-auto'
							initial='hidden'
							animate='visible'
							exit='hidden'
							variants={overlayVariants}>
							<motion.div
								className='relative flex h-full w-full max-w-lg flex-col gap-y-5 rounded-xl bg-white p-6 text-gray-600 shadow-lg dark:bg-gray-800 dark:text-gray-300'
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
									className='flex flex-col gap-y-4 pb-20 space-y-4 overflow-y-auto text-xs text-gray-600 dark:text-gray-300'>
									{/* TIPO ACCESO */}
									<div className='space-y-4'>
										<h2 className='text-base font-medium'>Tipo de acceso</h2>
										<div className='grid grid-cols-2 gap-4'>
											{[
												{
													value: 'access_internal',
													label: 'Acceso Interno',
													icon: <BiSolidFace size={32} />,
												},
												{ value: 'access_external', label: 'Acceso Externo', icon: <BiSolidFaceMask size={32} /> },
											].map(option => (
												<label
													key={option.value}
													className={`p-4 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer font-medium uppercase transition-all ease-in-out duration-300 
														${
															errors.type_access
																? 'dark:bg-gray-700/40 dark:text-red-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-all ease-in-out duration-300'
																: watch('type_access') === option.value
																	? 'dark:bg-amber-100 dark:text-gray-800'
																	: 'dark:bg-gray-700/50 dark:text-gray-300 dark:hover:bg-gray-700'
														}`}>
													<input type='radio' value={option.value} {...register('type_access')} className='hidden' />
													<div>{option.icon}</div>
													<span>{option.label}</span>
												</label>
											))}

											{errors.type_access && (
												<div className='text-red-500 text-xs flex items-start gap-1 font-normal'>
													<BiInfoCircle size={16} /> <p>{errors.type_access.message}</p>
												</div>
											)}
										</div>
									</div>

									{typeAccess && (
										<>
											<hr className='border-gray-700' />

											{/* FACULTAD - CARRERA */}
											{watch('type_access') !== 'access_external' && (
												<>
													<div className='space-y-4'>
														<h2 className='text-base font-medium'>Facultad</h2>
														<div className='grid grid-cols-1 gap-4'>
															{faculties?.map(faculty => (
																<label
																	key={faculty.id_faculty}
																	className={`justify-start p-3 rounded-lg flex flex-col gap-2 cursor-pointer font-medium uppercase transition-all ease-in-out duration-300 ${
																		errors.faculty
																			? 'dark:bg-gray-700/40 dark:text-red-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-all ease-in-out duration-300'
																			: watch('faculty') === faculty.id_faculty
																				? 'dark:bg-cyan-100 dark:text-gray-800'
																				: 'dark:bg-gray-700/50 dark:text-gray-300 dark:hover:bg-gray-700'
																	}`}
																	onClick={() => handleFacultyChange(faculty.id_faculty)}>
																	<input
																		type='radio'
																		value={faculty.id_faculty}
																		{...register('faculty')}
																		className='hidden'
																	/>

																	<span className='break-words line-clamp-1'>{faculty.name}</span>
																</label>
															))}
															{errors.faculty && <p className='text-red-500'>{errors.faculty.message}</p>}
														</div>
													</div>

													<hr className='border-gray-700' />

													{selectedFaculty && (
														<div className='space-y-4'>
															<h2 className='text-base font-medium'>Carrera</h2>
															<div className='grid grid-cols-2 gap-4'>
																{faculties
																	.find(faculty => faculty.id_faculty === selectedFaculty)
																	?.carrers?.map(career => (
																		<label
																			key={career.id_career}
																			className={`p-3 rounded-lg flex flex-col items-start gap-2 cursor-pointer font-medium uppercase transition-all ease-in-out duration-300 ${
																				errors.career
																					? 'dark:bg-gray-700/40 dark:text-red-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-all ease-in-out duration-300'
																					: watch('career') === career.id_career
																						? 'dark:bg-red-100 dark:text-gray-800'
																						: 'dark:bg-gray-700/50 dark:text-gray-300 dark:hover:bg-gray-700'
																			}`}>
																			<input
																				type='radio'
																				value={career.id_career}
																				{...register('career')}
																				className='hidden'
																			/>
																			<span className='break-words line-clamp-1'>{career.name}</span>
																		</label>
																	))}
															</div>
															{errors.career && <p className='text-red-500'>{errors.career.message}</p>}
														</div>
													)}

													{selectedFaculty && <hr className='border-gray-700' />}
												</>
											)}

											{/* DATOS DE LA INVESTIGACIÓN */}
											<div className='space-y-4'>
												<h2 className='text-base'>Datos de la investigación</h2>
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

												<div className='grid grid-cols-2 gap-4'>
													<InputFieldZod
														type='time'
														label='Hora de ingreso'
														placeholder='Hora de ingreso'
														register={register('startTime')}
														error={errors.startTime}
													/>
													<InputFieldZod
														type='time'
														label='Hora de salida'
														placeholder='Hora de salida'
														register={register('endTime')}
														error={errors.endTime}
													/>
												</div>
											</div>

											<hr className='border-gray-700' />

											<div className='space-y-4'>
												<h2 className='text-base font-medium'>Laboratorios</h2>
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
																		? 'dark:bg-amber-100 dark:text-gray-800'
																		: errors?.labs
																			? 'dark:bg-gray-700/40 dark:text-red-400 dark:hover:bg-gray-700 dark:hover:text-gray-300'
																			: 'dark:bg-gray-700/50 dark:text-gray-300 dark:hover:bg-gray-700'
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

											<hr className='border-gray-700' />

											{/* ADSCRIPCIÓN */}
											<div className='space-y-4'>
												<h2 className='text-base font-medium'>Adscripción</h2>
												<InputFieldZod
													label='Proyecto de investigación y/o vinculación u otro (adscrito)'
													placeholder='Proyecto de investigación y/o vinculación u otro (adscrito)'
													register={register('attached')}
													error={errors.attached}
												/>
												<TextTareaFieldZod
													label='Análisis requeridos'
													placeholder='Análisis requeridos'
													register={register('analysis_required')}
													error={errors.analysis_required}
												/>
											</div>

											{/* DIRECTOR */}
											{watch('type_access') !== 'access_external' && (
												<>
													<hr className='border-gray-700' />
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
												</>
											)}

											<hr className='border-gray-700' />

											{/* APLICANTES */}
											<div className='space-y-4'>
												<h2 className='text-base font-medium'>Aplicantes</h2>
												{applicants.map((applicant, index) => (
													<div key={index} className='flex flex-col space-y-3 gap-2 dark:bg-gray-700/40 p-4 rounded-lg'>
														<div className='flex items-center justify-between font-medium'>
															<span>Datos aplicante {index + 1}</span>
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
													<Button
														variant='none'
														size='small'
														disabled={loading || applicants.length === 0}
														iconStart={<BiSolidXCircle />}
														onClick={handleRemoveLastApplicant}>
														Remover último
													</Button>
												</div>
											</div>

											<hr className='border-gray-700' />

											{/* OBSERVACIONES */}
											<div className='space-y-4'>
												<h2 className='text-base font-medium'>Observaciones</h2>
												<TextTareaFieldZod
													label='Observaciones'
													placeholder='Observaciones'
													register={register('observations')}
													error={errors.observations}
												/>
											</div>
										</>
									)}

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
