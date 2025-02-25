import { useForm } from 'react-hook-form'
import { LuArchive, LuSearch, LuX } from 'react-icons/lu'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '../../../../components/Button/Button'
import { InputFieldZod } from '../../../../components/Input/InputFieldZod'
import { consumption_schema_zod } from '../../validators/consumptionValidator'
import { SpinnerLoading } from '../../../../components/Loaders/SpinnerLoading'
import { BiSolidUser, BiX } from 'react-icons/bi'
import { useAllReactivesStore } from '../../../../hooks/useReactive'
import { NotFound } from '../../../../components/Banner/NotFound'
import { formatISOToDate } from '../../../../helpers/dateTimeZone.helper'

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

export const ConsumptionForm = ({ text, onSubmit, onClose, onChange, loading, formData, accesData }) => {
	const [modalOpen, setModalOpen] = useState(true)

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
		watch,
	} = useForm({
		resolver: zodResolver(consumption_schema_zod),
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
		reactivesData,
		search,
		setSearch,
		handleSearchChange,
	} = useAllReactivesStore()

	const [selectedReactive, setSelectedReactive] = useState(null)
	const handleReactiveChange = reactive => {
		const isSameReactive = selectedReactive?.id_reactive === reactive.id_reactive
		const newReactive = isSameReactive ? null : reactive
		setSelectedReactive(newReactive)
		setValue('reactive', newReactive ? newReactive.id_reactive : null)
	}

	const [selectedLab, setSelectedLab] = useState(null)
	const handleLabChange = lab => {
		setSelectedLab(prevLab => {
			const isSameLab = prevLab?.id_lab === lab.id_lab
			const newLab = isSameLab ? null : lab
			setValue('lab', newLab ? newLab.id_lab : null)
			return newLab
		})
	}

	// ANALYSIS
	const [selectedAnalysis, setSelectedAnalysis] = useState(null)
	const handleAnalysisChange = analysis => {
		setSelectedAnalysis(prevAnalysis => {
			const isSameAnalysis =
				prevAnalysis?.experiments_parameter?.id_experiment_parameter ===
				analysis.experiments_parameter.id_experiment_parameter
			const newAnalysis = isSameAnalysis ? null : analysis
			setValue('analysis', newAnalysis ? newAnalysis.experiments_parameter.id_experiment_parameter : null)
			return newAnalysis
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
									<div className='space-y-4'>
										{/* UNIT MEASUREMENT */}
										<div className='space-y-4'>
											<h2 className='text-xs font-medium'>Reactivo</h2>
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
												) : reactivesData?.length === 0 ? (
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
																{reactivesData?.map(reactive => (
																	<div
																		key={reactive.id_reactive}
																		className='rounded-lg flex flex-col justify-center gap-2 cursor-pointer font-medium transition-all ease-in-out duration-300'>
																		<input
																			type='radio'
																			id={`reactive-${reactive.id_reactive}`}
																			value={reactive.id_reactive}
																			checked={selectedReactive?.id_reactive === reactive.id_reactive}
																			onChange={() => {
																				handleReactiveChange(reactive)
																				setSearch('')
																			}}
																			className='hidden'
																		/>
																		<label
																			htmlFor={`reactive-${reactive.id_reactive}`}
																			className={`p-3 rounded-lg flex flex-col justify-center gap-2 cursor-pointer font-medium transition-all ease-in-out duration-300 ${
																				selectedReactive?.id_reactive === reactive.id_reactive
																					? 'dark:bg-gray-700 dark:text-gray-200 bg-slate-200/50'
																					: errors?.reactive
																						? 'dark:bg-gray-700/40 text-red-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 hover:bg-slate-100/50'
																						: 'dark:bg-gray-700/30 dark:text-gray-300 dark:hover:bg-gray-700/60 hover:bg-slate-100/50'
																			}`}>
																			<div className='flex flex-col gap-2'>
																				<div className='flex items-center justify-between'>
																					<span className='break-words line-clamp-1'>
																						<strong>cod: </strong>
																						{reactive.code}
																					</span>
																					<span
																						className={`break-words line-clamp-1 font-semibold ${
																							reactive.status ? 'text-emerald-500' : 'text-red-500'
																						}`}>
																						{reactive.status ? 'Disponible' : 'No disponible'}
																					</span>
																				</div>

																				<div className='flex items-start flex-col'>
																					<span className='break-words line-clamp-1 text-sm'>{reactive.name}</span>
																					<div className='pt-3 flex items-center gap-12'>
																						<span>
																							<strong>Cnt disponible: </strong>
																							{parseFloat(reactive?.current_quantity).toString()} {reactive.unit?.unit}{' '}
																							({reactive.unit?.name})
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

											{selectedReactive ? (
												<>
													<h2 className='text-base font-medium'>Reactivo seleccionada</h2>
													<div className='flex flex-col gap-4 mt-2'>
														<motion.div
															key={selectedReactive.id_reactive}
															className='pb-1 space-x-3 flex items-center'
															initial={{ opacity: 0, scale: 0.8 }}
															animate={{ opacity: 1, scale: 1 }}
															exit={{ opacity: 0, scale: 0.8 }}>
															<Button
																variant='none'
																size='small'
																disabled={loading}
																onClick={() => handleReactiveChange(selectedReactive)}>
																<LuX size={16} />
															</Button>

															<div className='flex flex-col gap-2 w-full'>
																<div className='flex items-center justify-between'>
																	<span className='break-words line-clamp-1'>
																		<strong>cod: </strong>
																		{selectedReactive.code}
																	</span>
																	<span
																		className={`break-words line-clamp-1 font-semibold ${
																			selectedReactive.status ? 'text-emerald-500' : 'text-red-500'
																		}`}>
																		{selectedReactive.status ? 'Disponible' : 'No disponible'}
																	</span>
																</div>

																<div className='flex items-start flex-col'>
																	<span className='break-words line-clamp-1 text-sm'>{selectedReactive.name}</span>
																	<div className='pt-3 flex items-center gap-12'>
																		<span>
																			<strong>Cnt disponible: </strong>
																			{parseFloat(selectedReactive?.current_quantity).toString()}{' '}
																			{selectedReactive.unit?.unit} ({selectedReactive.unit?.name})
																		</span>
																	</div>
																</div>
															</div>
														</motion.div>
													</div>
												</>
											) : (
												<>
													{errors.reactive ? (
														<p className='text-red-500'>{errors.reactive.message}</p>
													) : (
														<p>No has seleccionado ningún reactivo.</p>
													)}
												</>
											)}

											<InputFieldZod
												label='Cantidad'
												placeholder='Cantidad'
												register={register('amount')}
												error={errors.amount}
											/>

											<h2 className='text-xs font-medium pt-4'>Laboratorio</h2>
											<div className='grid grid-cols-1 gap-4'>
												<div className='grid grid-cols-1 gap-4'>
													{accesData?.labs?.map(labItem => (
														<div
															key={labItem.lab.id_lab}
															className='rounded-lg flex flex-col justify-center gap-2 cursor-pointer font-medium transition-all ease-in-out duration-300'>
															<input
																type='radio'
																id={`lab-${labItem.lab.id_lab}`}
																value={labItem.lab.id_lab}
																checked={selectedLab?.id_lab === labItem.lab.id_lab}
																onChange={() => handleLabChange(labItem.lab)}
																className='hidden'
															/>

															<label
																htmlFor={`lab-${labItem.lab.id_lab}`}
																className={`p-3 rounded-lg flex flex-col justify-center gap-2 cursor-pointer font-medium transition-all ease-in-out duration-300 ${
																	selectedLab?.id_lab === labItem.lab.id_lab
																		? 'dark:bg-yellow-100 dark:text-gray-700 bg-slate-200'
																		: errors?.lab
																			? 'dark:bg-gray-700/40 text-red-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 hover:bg-slate-100/50'
																			: 'dark:bg-gray-700/30 dark:text-gray-300 dark:hover:bg-gray-700/60 hover:bg-slate-100/50'
																}`}>
																<div className='flex flex-col gap-2'>
																	<div className='flex items-start flex-col gap-2'>
																		<span className='break-words line-clamp-1 font-semibold'>{labItem.lab.name}</span>
																		<div className='text-xs flex items-center gap-1'>
																			<BiSolidUser />
																			<span>{labItem?.analyst?.full_name}</span>
																		</div>
																	</div>
																</div>
															</label>
														</div>
													))}
												</div>
											</div>

											{errors.lab ? <p className='text-red-500'>{errors.lab.message}</p> : <p></p>}
										</div>
									</div>

									<hr className='dark:border-gray-700' />
									<div>
										<h2 className='text-sm font-medium pb-4'>Análisis</h2>
										<div className='grid grid-cols-1 gap-4'>
											<div className='grid grid-cols-1 gap-4'>
												{accesData?.experiments?.map(analysisItem => (
													<div
														key={analysisItem?.analysis?.experiments_parameter?.id_experiment_parameter}
														className='rounded-lg flex flex-col justify-center gap-2 cursor-pointer font-medium transition-all ease-in-out duration-300'>
														<input
															type='radio'
															id={`analysis-${analysisItem?.analysis?.experiments_parameter?.id_experiment_parameter}`}
															value={analysisItem?.analysis?.experiments_parameter?.id_experiment_parameter}
															checked={
																selectedAnalysis?.experiments_parameter?.id_experiment_parameter ===
																analysisItem?.analysis?.experiments_parameter?.id_experiment_parameter
															}
															onChange={() => handleAnalysisChange(analysisItem?.analysis)}
															className='hidden'
														/>

														<label
															htmlFor={`analysis-${analysisItem?.analysis?.experiments_parameter?.id_experiment_parameter}`}
															className={`p-3 rounded-lg flex flex-col justify-center gap-2 cursor-pointer font-medium transition-all ease-in-out duration-300 ${
																selectedAnalysis?.experiments_parameter?.id_experiment_parameter ===
																analysisItem?.analysis?.experiments_parameter?.id_experiment_parameter
																	? 'dark:bg-yellow-100 dark:text-gray-700 bg-slate-200'
																	: errors?.lab
																		? 'dark:bg-gray-700/40 text-red-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 hover:bg-slate-100/50'
																		: 'dark:bg-gray-700/30 dark:text-gray-300 dark:hover:bg-gray-700/60 hover:bg-slate-100/50'
															}`}>
															<div className='flex flex-col gap-2'>
																<div className='flex items-start flex-col gap-1'>
																	<span className='break-words line-clamp-1 font-semibold'>
																		{analysisItem?.analysis?.experiments_parameter?.name}
																	</span>
																	<div className='text-xs flex items-center gap-1'>
																		<span>
																			Categoria:{' '}
																			{analysisItem?.analysis?.experiments_parameter?.experiments_category?.name}
																		</span>
																	</div>
																</div>
															</div>
														</label>
													</div>
												))}
											</div>
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
