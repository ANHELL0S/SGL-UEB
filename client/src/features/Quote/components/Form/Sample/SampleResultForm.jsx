import { useForm } from 'react-hook-form'
import { LuArchive, LuSearch, LuX } from 'react-icons/lu'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '../../../../../components/Button/Button'
import { InputFieldZod } from '../../../../../components/Input/InputFieldZod'
import { sample_result_schema_zod } from '../../../validators/sampleResultValidator'
import { TextTareaFieldZod } from '../../../../../components/Input/TextTareaFieldZod'
import { BiX } from 'react-icons/bi'
import { useAllUnitMeasurementStore } from '../../../../../hooks/useUnitMeasurement'
import { NotFound } from '../../../../../components/Banner/NotFound'
import { formatISOToDate } from '../../../../../helpers/dateTimeZone.helper'
import { Banner } from '../../Banner/Banner'

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

export const SampleResultForm = ({ text, onSubmit, onClose, onChange, loading, formData, experiments }) => {
	const [modalOpen, setModalOpen] = useState(true)
	const [selectedAnalysis, setSelectedAnalysis] = useState(formData?.analysis || '')

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
		watch,
	} = useForm({
		resolver: zodResolver(sample_result_schema_zod),
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

	const handleSelectAnalysis = analysisId => {
		setSelectedAnalysis(analysisId)
		setValue('analysis', analysisId)
	}

	const messages = ['Selecciona el análisis correspondiente (cotizados).']

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
										<div className='space-y-4'>
											<h4 className='mb-2 font-semibold'>Seleccione un análisis:</h4>
											<Banner messages={messages} type='info' />
											<div className='grid grid-cols-1 gap-4 max-h-96 overflow-auto'>
												{experiments?.map((exp, index) => {
													const analysisId = exp.experiment.id_experiment_parameter
													return (
														<div
															key={analysisId || index}
															className={`p-3 text-xs space-y-1 dark:bg-gray-700/40 bg-slate-50 rounded-lg cursor-pointer transition-all ease-in-out duration-200 ${
																selectedAnalysis === analysisId
																	? 'dark:bg-purple-300 bg-purple-300 text-gray-700 dark:text-gray-700'
																	: 'dark:hover:bg-gray-700'
															}`}
															onClick={() => handleSelectAnalysis(analysisId)}>
															<p className={`font-bold ${exp.experiment.deletedAt ? 'line-through text-red-500' : ''}`}>
																{exp.experiment.name}
															</p>
															<p className={`${exp.experiment.category?.deletedAt ? 'line-through text-red-500' : ''}`}>
																Categoría: {exp.experiment.category?.name}
															</p>
														</div>
													)
												})}
											</div>
											{errors.analysis && <p className='text-red-500 text-xs'>{errors.analysis.message}</p>}
										</div>

										<InputFieldZod
											label='Resultados'
											placeholder='Resultados de la muestra'
											register={register('result')}
											error={errors.result}
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
