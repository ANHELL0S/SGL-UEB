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
import { ExperimentTable } from './components/Table/ExperimentTable'

export const ExperimentSection = () => {
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
	const { isVisible: showCreatedModal, openModal: handleCreated, closeModal: toggleCreatedModal } = useCreated()
	const handleOpenCreatedModal = () => handleCreated()

	// UPDATED
	const { isVisible: showUpdatedModal, openModal: handleUpdated, closeModal: toggleUpdatedModal } = useUpdated()
	const handleOpenUpdatedModal = data => {
		setSelected(data)
		handleUpdated(data)
		toggleDropdown(null)
	}

	// ACTIVE
	const { isVisible: showActivedModal, openModal: handleActived, closeModal: toggleActivedModal } = useActived()
	const handleOpenActivedModal = data => {
		setSelected(data)
		handleActived(data)
		toggleDropdown(null)
	}

	// DESACTIVE
	const {
		isVisible: showDesactivedModal,
		openModal: handleDesactived,
		closeModal: toggleDesactivedModal,
	} = useDesactived()
	const handleOpenDesactivedModal = data => {
		setSelected(data)
		handleDesactived(data)
		toggleDropdown(null)
	}

	// DELETED
	const { isVisible: showDeletedModal, openModal: handleDeleted, closeModal: toggleDeletedModal } = useDelete()
	const handleOpenDeletedModal = data => {
		setSelected(data)
		handleDeleted(data)
		toggleDropdown(null)
	}

	if (error) return <Status500 text={error} />

	const renderState = () => {
		if (loading)
			return (
				<div className='flex items-center justify-center py-52'>
					<SpinnerLoading />
				</div>
			)

		if (experimentsData?.length === 0) {
			const notFoundProps = !search
				? {
						icon: <LuArchive size={50} />,
						title: 'Sin registros',
						description: 'Lo sentimos, no se encontró ningún laboratorio.',
					}
				: {
						icon: <LuSearch size={50} />,
						title: 'Sin resultados',
						description: 'Lo sentimos, no se encontrarón laboratorios que coincidan con tu búsqueda.',
					}
			return (
				<div className='flex justify-center py-32'>
					<NotFound {...notFoundProps} />
				</div>
			)
		}

		return (
			<ExperimentTable
				experimentsData={experimentsData}
				toggleDropdown={toggleDropdown}
				dropdownVisible={dropdownVisible}
				handleOpenUpdatedModal={handleOpenUpdatedModal}
				handleOpenActivedModal={handleOpenActivedModal}
				handleOpenDeletedModal={handleOpenDeletedModal}
				handleOpenDesactivedModal={handleOpenDesactivedModal}
			/>
		)
	}

	return (
		<>
			<main className='space-y-4'>
				<section className='text-2xl dark:text-gray-200 text-slate-600 font-semibold relative flex items-center gap-2'>
					<h1>Experimentos</h1>
				</section>

				<section className='flex items-center justify-between flex-wrap lg:flex-nowrap'>
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

					<div className='flex items-center justify-between gap-4 flex-wrap lg:flex-nowrap'>
						<div className='flex gap-4 flex-wrap'>
							<Button variant='secondary' size='small'>
								Reporte
							</Button>
							<Button variant='primary' size='small' onClick={() => handleOpenCreatedModal()}>
								Nuevo laboratorio
							</Button>
						</div>
					</div>
				</section>

				<section className='space-y-4'>
					<div className='flex items-center gap-4 w-full flex-wrap justify-between text-xs text-slate-500 dark:text-gray-300 font-semibold dark:bg-gray-700/40 bg-slate-100 p-2 rounded-lg'>
						<div className='flex items-center space-x-1'>
							<div className='flex text-slate-500 text-xs pr-2 dark:text-slate-200 w-full sm:w-auto'>
								<button
									onClick={() => handlePageChange(page - 1)}
									disabled={!totalRecords || page === 1}
									className={`transition-all px-2 py-1 rounded duration-300 flex items-center ${
										!totalRecords
											? 'bg-transparent cursor-not-allowed opacity-50'
											: page === 1
												? 'cursor-not-allowed opacity-50'
												: 'dark:hover:bg-gray-700 ease-in-out'
									}`}>
									<BiCaretLeft size={16} />
									<span>Anterior</span>
								</button>

								<button
									onClick={() => handlePageChange(page + 1)}
									disabled={!totalRecords || page === totalPages}
									className={`transition-all px-2 py-1 rounded duration-300 flex items-center ${
										!totalRecords
											? 'bg-transparent cursor-not-allowed opacity-50'
											: page === totalPages
												? 'cursor-not-allowed opacity-50'
												: 'dark:hover:bg-gray-700 ease-in-out'
									}`}>
									<span>Siguiente</span>
									<BiCaretRight size={16} />
								</button>
							</div>
							<div className='border-l pl-4 dark:border-gray-600'>
								<span>
									{totalPages && totalRecords
										? `Mostrando ${page} - ${totalPages || 0} de ${totalRecords} resultados`
										: ''}
								</span>
							</div>
						</div>

						<div className={`space-x-2 ${!totalRecords ? 'opacity-50 cursor-not-allowed' : ''}`}>
							<span>Resultados por página:</span>
							<select
								id='limit'
								value={limit}
								onChange={handleLimitChange}
								disabled={!totalRecords}
								className={`p-1 rounded transition ease-in-out duration-300 w-20 sm:w-auto mt-2 sm:mt-0 ${
									!totalRecords
										? 'bg-transparent cursor-not-allowed'
										: 'cursor-pointer bg-slate-200 dark:bg-slate-700 hover:bg-slate-300/70 dark:hover:bg-slate-600'
								}`}>
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

			{showCreatedModal && <ModalCreate onClose={toggleCreatedModal} onSuccess={fetchExperimentsData} />}
			{showUpdatedModal && (
				<ModalUpdate experiment={selected} onClose={toggleUpdatedModal} onSuccess={fetchExperimentsData} />
			)}
			{showActivedModal && (
				<ModalStatusActive experiment={selected} onClose={toggleActivedModal} onSuccess={fetchExperimentsData} />
			)}
			{showDesactivedModal && (
				<ModalStatusDesactive experiment={selected} onClose={toggleDesactivedModal} onSuccess={fetchExperimentsData} />
			)}
			{showDeletedModal && (
				<ModalDelete experiment={selected} onClose={toggleDeletedModal} onSuccess={fetchExperimentsData} />
			)}
		</>
	)
}
