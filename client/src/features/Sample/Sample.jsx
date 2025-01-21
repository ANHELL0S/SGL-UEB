import { useState } from 'react'
import { useActived, useCreated, useDelete, useDesactived, useUpdated } from './hook/useCRUD'
import { useSelected } from './hook/useSelected'
import { useDropdown } from './hook/useDropdown'
import { Button } from '../../components/Button/Button'
import { NotFound } from '../../components/Banner/NotFound'
import { formatISOToDate } from '../../helpers/dateTimeZone.helper'
import { SpinnerLoading } from '../../components/Loaders/SpinnerLoading'
import {
	ModalCreate,
	ModalDelete,
	ModalStatusActive,
	ModalStatusDesactive,
	ModalUpdate,
} from './components/Form/Experiment-CRUD'
import {
	BiX,
	BiTable,
	BiEditAlt,
	BiSolidLockAlt,
	BiDotsVertical,
	BiSolidBadgeCheck,
	BiSolidDollarCircle,
	BiReset,
	BiCaretLeft,
	BiCaretRight,
} from 'react-icons/bi'
import { LuArchive, LuLayoutGrid, LuSearch, LuTrash2 } from 'react-icons/lu'
import { useAllExperimentsStore } from '../../hooks/useExperiment'
import { Status500 } from '../../components/Banner/StatusServer'

export const SampleSection = () => {
	const {
		loading,
		error,
		page,
		limit,
		search,
		setSearch,
		fetchExperimentsData,
		handleKeyDown,
		handleSearchChange,
		handleLimitChange,
		handlePageChange,
		totalRecords,
		totalPages,
		experimentsData,
	} = useAllExperimentsStore()

	// UTILS - MODALS CRUD
	const { selected, setSelected } = useSelected()
	const { dropdownVisible, toggleDropdown } = useDropdown()

	// CREATED
	const { showCreateModal, handleCreate, toggleCreateModal } = useCreated()
	const handleOpenCreatedModal = () => handleCreate()

	// UPDATED
	const { showUpdateModal, handleUpdate, toggleUpdateModal } = useUpdated()
	const handleOpenUpdatedModal = data => {
		setSelected(data)
		handleUpdate(data)
		toggleDropdown(null)
	}

	// ACTIVE
	const { showActiveModal, handleActive, toggleActiveModal } = useActived()
	const handleOpenActivedModal = data => {
		setSelected(data)
		handleActive(data)
		toggleDropdown(null)
	}

	// DESACTIVE
	const { showDesactiveModal, handleDesactive, toggleDesactiveModal } = useDesactived()
	const handleOpenDesactivedModal = data => {
		setSelected(data)
		handleDesactive(data)
		toggleDropdown(null)
	}

	// DELETED
	const { showDeleteModal, handleDelete, toggleDeleteModal } = useDelete()
	const handleOpenDeletedModal = data => {
		setSelected(data)
		handleDelete(data)
		toggleDropdown(null)
	}

	const [viewType, setViewType] = useState('table')
	const handleViewChange = type => setViewType(type)

	if (error) return <Status500 text={error} />

	const renderState = () => {
		if (loading) {
			return (
				<div className='flex items-center justify-center py-32'>
					<SpinnerLoading />
				</div>
			)
		}

		if (experimentsData?.length === 0) {
			const notFoundProps = !search
				? {
						icon: <LuArchive size={50} />,
						title: 'Sin registros',
						description: 'Lo sentimos, no se encontró ningún acceso a laboratorios.',
					}
				: {
						icon: <LuSearch size={50} />,
						title: 'Sin resultados',
						description: 'Lo sentimos, no se encontraron accesos que coincidan con tu búsqueda.',
					}
			return (
				<div className='flex justify-center py-32'>
					<NotFound {...notFoundProps} />
				</div>
			)
		}

		return viewType === 'table' ? (
			<table className='min-w-full text-xs font-medium text-left'>
				<thead className='dark:text-gray-400'>
					<tr className='text-slate-500 dark:text-gray-300/80'>
						<th className='px-2 py-1.5'>Nombre</th>
						<th className='px-2 py-1.5'>Precio público</th>
						<th className='px-2 py-1.5'>Precio interno</th>
						<th className='px-2 py-1.5'>Estado</th>
						<th className='px-2 py-1.5'>Creado</th>
						<th className='px-2 py-1.5'>Acciones</th>
					</tr>
				</thead>
				<tbody>
					{experimentsData?.map(experiment => (
						<tr
							key={experiment?.id_experiment}
							className='hover:bg-slate-50 dark:hover:bg-slate-700/30 border-t dark:border-t-gray-700 dark:text-gray-400 text-slate-600 text-xs'>
							<td className='px-2 py-1.5 dark:text-slate-300'>
								<ul className='space-y-0.5'>
									<li className='flex items-center'>
										<span className='break-words line-clamp-1'>{experiment?.name}</span>
									</li>
								</ul>
							</td>

							<td className='px-2 py-1.5 dark:text-slate-300'>
								<ul className='space-y-0.5'>
									<li className='flex items-center'>
										<span className='break-words line-clamp-1'>{experiment?.public_price}</span>
									</li>
								</ul>
							</td>

							<td className='px-2 py-1.5 dark:text-slate-300'>
								<ul className='space-y-0.5'>
									<li className='flex items-center'>
										<span className='break-words line-clamp-1'>{experiment?.internal_price}</span>
									</li>
								</ul>
							</td>

							<td className='px-2 py-1.5 dark:text-slate-300'>
								<li className='flex items-center'>
									<li className='flex items-center'>
										<span
											className={`break-words line-clamp-1 font-semibold px-2 py-0.5 rounded-full ${
												experiment?.status
													? 'dark:text-teal-300 dark:bg-teal-700/50 bg-teal-100 text-teal-500'
													: 'dark:text-red-300 dark:bg-red-700/50 bg-red-100 text-red-500'
											}`}>
											{experiment?.status ? 'Activo' : 'Inactivo'}
										</span>
									</li>
								</li>
							</td>

							<td className='px-2 py-1.5 dark:text-slate-300'>
								<ul className='space-y-0.5'>
									<li className='flex items-center'>
										<span className='break-words line-clamp-2'>{formatISOToDate(experiment.createdAt)}</span>
									</li>
								</ul>
							</td>

							<td className='px-2 text-xs py-1.5'>
								<button
									className='p-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600/50 rounded-full transition-all ease-in-out duration-300'
									onClick={() => toggleDropdown(experiment?.id_experiment)}>
									<BiDotsVertical size={16} />
								</button>
								<div className='absolute inline-block'>
									{dropdownVisible === experiment?.id_experiment && (
										<div className='absolute right-0 mt-10 px-1 border dark:border-gray-500 w-max bg-white dark:bg-slate-700 rounded-lg shadow-lg z-10'>
											<ul className='py-1 text-xs space-y-0 text-slate-500 dark:text-slate-300 font-medium'>
												<li>
													<button
														className='dark:text-slate-300 flex items-center gap-2 w-full text-left p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg'
														onClick={() => handleOpenUpdatedModal(experiment)}>
														<BiEditAlt size={14} />
														Editar experimento
													</button>
												</li>
												<li>
													{experiment?.status ? (
														<button
															className='flex items-center gap-2 w-full text-left p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg'
															onClick={() => handleOpenDesactivedModal(experiment)}>
															<BiReset size={14} />
															Inhabilitar experimento
														</button>
													) : (
														<button
															className='flex items-center gap-2 w-full text-left p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg'
															onClick={() => handleOpenActivedModal(experiment)}>
															<BiReset size={14} />
															Habilitar experimento
														</button>
													)}
												</li>
												<li>
													<button
														className='w-full text-left p-2 hover:bg-slate-100 dark:hover:bg-slate-600 flex items-center gap-2 rounded-lg text-red-500'
														onClick={() => handleOpenDeletedModal(experiment)}>
														<LuTrash2 size={14} />
														Eliminar experimento
													</button>
												</li>
											</ul>
										</div>
									)}
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		) : (
			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
				{experimentsData?.map(experiment => (
					<div
						key={experiment?.id_access_lab}
						className='bg-white/50 dark:bg-slate-700/30 border p-4 rounded-lg transition-all text-slate-600 dark:border-gray-700 dark:text-gray-300 flex flex-col h-full space-y-2'>
						<div className='flex items-center justify-between'>
							<span className='text-xs'>{formatISOToDate(experiment?.createdAt)}</span>
							<div className='relative'>
								<button
									className='p-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600/50 rounded-full transition-all ease-in-out duration-300'
									onClick={() => toggleDropdown(experiment?.id_experiment)}>
									<BiDotsVertical size={16} />
								</button>
								{dropdownVisible === experiment?.id_experiment && (
									<div className='absolute right-0 mt-2 px-1 border dark:border-gray-500 w-max bg-white dark:bg-slate-700 rounded-lg shadow-lg z-10'>
										<ul className='py-1 text-xs space-y-0 text-slate-500 dark:text-slate-300 font-medium'>
											<li>
												<button
													className='dark:text-slate-300 flex items-center gap-2 w-full text-left p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg'
													onClick={() => handleOpenUpdatedModal(experiment)}>
													<BiEditAlt size={14} />
													Editar experimento
												</button>
											</li>
											<li>
												{experiment?.status ? (
													<button
														className='flex items-center gap-2 w-full text-left p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg'
														onClick={() => handleOpenDesactivedModal(experiment)}>
														<BiReset size={14} />
														Desactivar experimento
													</button>
												) : (
													<button
														className='flex items-center gap-2 w-full text-left p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg'
														onClick={() => handleOpenActivedModal(experiment)}>
														<BiReset size={14} />
														Activar experimento
													</button>
												)}
											</li>
											<li>
												<button
													className='w-full text-left p-2 hover:bg-slate-100 dark:hover:bg-slate-600 flex items-center gap-2 rounded-lg text-red-500'
													onClick={() => handleOpenDeletedModal(experiment)}>
													<LuTrash2 size={14} />
													Eliminar experimento
												</button>
											</li>
										</ul>
									</div>
								)}
							</div>
						</div>

						<div className='space-y-2'>
							<p className='text-lg font-semibold text-gray-600 dark:text-gray-200 flex items-center gap-1 break-words line-clamp-1'>
								{experiment?.name}
							</p>

							<p
								className={`text-sm break-words line-clamp-1 font-medium flex items-center gap-1 ${
									experiment?.status ? 'text-emerald-400' : 'text-red-400'
								}`}>
								<BiSolidBadgeCheck />
								{experiment?.status ? 'Disponible' : 'No disponible'}
							</p>
						</div>

						<div className='flex-grow'></div>
						<div className='grid md:grid-cols-1 lg:grid-cols-2 sm:grid-cols-1 gap-4'>
							<div className='flex items-center gap-2 bg-teal-50 dark:bg-teal-800/20 py-2 px-4 rounded-lg text-teal-500 dark:text-teal-300'>
								<BiSolidDollarCircle size={28} />
								<p className='text-sm break-words line-clamp-1 flex flex-col'>
									<span className='text-lg font-semibold text-teal-500 dark:text-teal-200'>
										${experiment?.public_price}
									</span>
									<span className='text-teal-500 text-xs dark:text-teal-300'>Precio público</span>
								</p>
							</div>

							<div className='flex items-center gap-2 bg-slate-50 dark:bg-gray-700/40 py-2 px-4 rounded-lg dark:text-gray-400'>
								<BiSolidLockAlt size={28} />
								<p className='text-sm break-words line-clamp-1 flex flex-col'>
									<span className='text-lg font-semibold text-slate-500 dark:text-gray-300'>
										${experiment?.internal_price}
									</span>
									<span className='text-slate-500 text-xs dark:text-gray-300'>Precio interno</span>
								</p>
							</div>
						</div>
					</div>
				))}
			</div>
		)
	}

	return (
		<>
			<main>
				<section className='justify-between flex items-center flex-wrap lg:flex-nowrap'>
					<section className='flex items-center gap-4 flex-wrap lg:flex-nowrap md:py-4 sm:py-4 py-4'>
						<div className='relative w-full'>
							<input
								type='text'
								placeholder='Buscar...'
								className='p-1.5 pl-6 pr-3 border-2 text-xs border-slate-200 rounded-lg dark:bg-gray-700 dark:border-gray-500 dark:text-gray-300 text-slate-600 font-medium w-full focus:outline-none'
								value={search}
								onChange={handleSearchChange}
								onKeyDown={handleKeyDown}
							/>
							<LuSearch
								className='absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-400'
								size={14}
							/>
							{search && (
								<button
									className='absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-300'
									onClick={() => setSearch('')}
									title='Resetear búsqueda'>
									<BiX size={20} />
								</button>
							)}
						</div>

						<div className='flex dark:bg-gray-700/40 bg-slate-100/80 rounded-md p-1 space-x-1'>
							<button
								className={`p-1  ${viewType === 'table' ? 'bg-slate-300/50 text-slate-500 dark:bg-gray-600' : ' text-slate-400 '} dark:border-slate-500 text-gray-700 dark:text-gray-300 rounded transition ease-in-out duration-300 hover:bg-slate-200 dark:hover:bg-slate-700`}
								onClick={() => handleViewChange('table')}>
								<BiTable size={18} />
							</button>
							<button
								className={`p-1  ${viewType === 'cards' ? 'bg-slate-300/50 text-slate-500 dark:bg-gray-600' : ' text-slate-400 '} dark:border-slate-500 text-gray-700 dark:text-gray-300 rounded transition ease-in-out duration-300 hover:bg-slate-200 dark:hover:bg-slate-700`}
								onClick={() => handleViewChange('cards')}>
								<LuLayoutGrid />
							</button>
						</div>
					</section>

					<section className='flex items-center justify-between gap-4 flex-wrap lg:flex-nowrap'>
						<div className='flex gap-4 flex-wrap'>
							<Button variant='primary' size='small' onClick={() => handleOpenCreatedModal()}>
								Nuevo experimento
							</Button>
						</div>
					</section>
				</section>

				<section className='space-y-4'>
					<div className='flex items-center gap-4 w-full flex-wrap justify-between text-xs text-slate-500 dark:text-gray-300 font-semibold dark:bg-gray-700/40 bg-slate-100/80 p-2 rounded-lg'>
						<div className='flex items-center space-x-1'>
							<div className='flex text-slate-500 text-xs pr-2 dark:text-slate-200 w-full sm:w-auto'>
								<button
									onClick={() => handlePageChange(page - 1)}
									disabled={page === 1}
									className={`transition-all px-2 py-1 ease-in-out dark:hover:bg-gray-700 rounded duration-300 flex items-center ${page === 1 ? 'cursor-not-allowed opacity-50' : ''}`}>
									<BiCaretLeft size={16} />
									<span>Anterior</span>
								</button>

								<button
									onClick={() => handlePageChange(page + 1)}
									disabled={page === totalPages}
									className={`transition-all px-2 py-1  ease-in-out dark:hover:bg-gray-700 rounded duration-300 flex items-center ${page === totalPages ? 'cursor-not-allowed opacity-50' : ''}`}>
									<span>Siguiente</span>
									<BiCaretRight size={16} />
								</button>
							</div>
							<div className='border-l pl-4 dark:border-gray-600'>
								<span>{`Mostrando ${page} - ${totalPages || 0} de ${totalRecords} resultados`}</span>
							</div>
						</div>

						<div className='space-x-2'>
							<span>Resultados por página:</span>
							<select
								id='limit'
								value={limit}
								onChange={handleLimitChange}
								className='p-1 cursor-pointer bg-slate-200 dark:bg-slate-700 rounded transition ease-in-out duration-300 hover:bg-slate-300/70 dark:hover:bg-slate-600 w-20 sm:w-auto mt-2 sm:mt-0'>
								<option value={5}>5</option>
								<option value={10}>10</option>
								<option value={50}>50</option>
								<option value={100}>100</option>
							</select>
						</div>
					</div>

					<div>{renderState()}</div>
				</section>
			</main>

			{showCreateModal && <ModalCreate onClose={toggleCreateModal} onSuccess={fetchExperimentsData} />}
			{showUpdateModal && (
				<ModalUpdate experiment={selected} onClose={toggleUpdateModal} onSuccess={fetchExperimentsData} />
			)}
			{showDeleteModal && (
				<ModalDelete experiment={selected} onClose={toggleDeleteModal} onSuccess={fetchExperimentsData} />
			)}

			{showActiveModal && (
				<ModalStatusActive experiment={selected} onClose={toggleActiveModal} onSuccess={fetchExperimentsData} />
			)}

			{showDesactiveModal && (
				<ModalStatusDesactive experiment={selected} onClose={toggleDesactiveModal} onSuccess={fetchExperimentsData} />
			)}
		</>
	)
}
