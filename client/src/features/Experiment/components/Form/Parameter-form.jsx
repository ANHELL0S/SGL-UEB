import { useState } from 'react'
import { LuArchive, LuSearch, LuX } from 'react-icons/lu'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { useAllCategoriesStore } from '../../../../hooks/useExperiment'
import { Button } from '../../../../components/Button/Button'
import { InputFieldZod } from '../../../../components/Input/InputFieldZod'
import { experiment_schema_zod } from '../../validators/experiment-validator'
import { SpinnerLoading } from '../../../../components/Loaders/SpinnerLoading'
import { BiX } from 'react-icons/bi'
import { NotFound } from '../../../../components/Banner/NotFound'

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

export const ParameterForm = ({ text, onSubmit, onClose, loading, formData }) => {
	const [modalOpen, setModalOpen] = useState(true)

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		setValue,
	} = useForm({
		resolver: zodResolver(experiment_schema_zod),
		defaultValues: formData,
	})

	const {
		loading: loadingCategories,
		error,
		page,
		limit,
		search,
		setSearch,
		fetchCategoriesData,
		handleKeyDown,
		handleSearchChange,
		handleLimitChange,
		handlePageChange,
		totalRecords,
		totalPages,
		categoriesData,
	} = useAllCategoriesStore(4)

	const [selectedCategory, setSelectedCategory] = useState(null)
	const handleCategoryChange = category => {
		if (selectedCategory?.id_experiment_category === category.id_experiment_category) {
			setSelectedCategory(null)
			setValue('category', '')
		} else {
			setSelectedCategory(category)
			setValue('category', category.id_experiment_category)
		}
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
								className='relative flex h-full w-full max-w-md flex-col gap-y-5 bg-white p-6 text-gray-600 shadow-lg dark:bg-gray-800 dark:text-gray-300'
								variants={modalVariants}
								onClick={e => e.stopPropagation()}>
								<div className='flex items-center justify-between'>
									<h3 className='text-lg font-semibold text-slate-600 dark:text-gray-100'>{text.title}</h3>

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
									className='flex flex-col gap-y-4 pb-20 overflow-y-auto text-xs text-gray-600 dark:text-gray-300 pr-3'>
									<InputFieldZod
										label='Nombre'
										placeholder='Ingrese el nombre del experimento'
										register={register('name')}
										error={errors.name}
									/>

									<InputFieldZod
										label='Precio público'
										placeholder='Ingrese el precio público'
										register={register('public_price')}
										error={errors.public_price}
									/>

									<div className='space-y-4'>
										<h2 className='text-base font-medium'>Categoria</h2>
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

										<div className='grid grid-cols-1 gap-4'>
											{loadingCategories ? (
												<div className='flex items-center justify-center py-4'>
													<SpinnerLoading />
												</div>
											) : categoriesData?.length === 0 ? (
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
															{categoriesData?.map(category => (
																<label
																	key={category.id_experiment_category}
																	htmlFor={`category-${category.id_experiment_category}`}
																	className={`p-3 rounded-lg flex flex-col items-start justify-center gap-2 cursor-pointer font-medium uppercase transition-all ease-in-out duration-300 ${
																		selectedCategory?.id_experiment_category === category.id_experiment_category
																			? 'dark:bg-amber-100 dark:text-gray-800'
																			: errors?.category
																				? 'dark:bg-gray-700/40 dark:text-red-400 dark:hover:bg-gray-700 dark:hover:text-gray-300'
																				: 'dark:bg-gray-700/50 dark:text-gray-300 dark:hover:bg-gray-700'
																	}`}>
																	<input
																		type='radio'
																		id={`category-${category.id_experiment_category}`}
																		value={category.id_experiment_category}
																		checked={
																			selectedCategory?.id_experiment_category === category.id_experiment_category
																		}
																		onChange={() => {
																			handleCategoryChange(category)
																			setSearch('')
																		}}
																		className='hidden'
																	/>
																	<div className='grid grid-cols-1 gap-2'>
																		<div className='flex items-center gap-2'>
																			<span className='font-semibold'>{category?.name}</span>
																		</div>
																	</div>
																</label>
															))}
														</div>
													)}
												</>
											)}
										</div>

										{selectedCategory ? (
											<>
												<h2 className='text-base font-medium'>Categoria seleccionada</h2>
												<div className='flex flex-col gap-4 mt-2'>
													<motion.div
														key={selectedCategory.id_experiment_category}
														className='pb-1 space-x-3 flex items-center'
														initial={{ opacity: 0, scale: 0.8 }}
														animate={{ opacity: 1, scale: 1 }}
														exit={{ opacity: 0, scale: 0.8 }}>
														<Button
															variant='none'
															size='small'
															disabled={loadingCategories}
															onClick={() => handleCategoryChange(selectedCategory)} // Elimina la categoría seleccionada
														>
															<LuX size={16} />
														</Button>
														<div className='gap-1 flex flex-col font-medium'>
															<span className='font-semibold'>{selectedCategory?.name}</span>
														</div>
													</motion.div>
												</div>
											</>
										) : (
											<div className='font-medium'>
												{errors.category ? (
													<p className='text-red-500'>{errors.category.message}</p>
												) : (
													<p>No has seleccionado ninguna categoria.</p>
												)}
											</div>
										)}
									</div>

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
