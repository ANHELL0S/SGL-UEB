import {
	ModalDeletePermanent,
	ModalUpdate,
	ModalAddResult,
	ModalUpdateResult,
	ModalDeleteResult,
} from '../Form/Sample/SampleCRUD'
import {
	BiDotsHorizontal,
	BiDotsVertical,
	BiSolidAddToQueue,
	BiSolidDownload,
	BiSolidEditAlt,
	BiSolidTrash,
} from 'react-icons/bi'
import { useDropdown } from '../../hook/useDropdown'
import { useAddResult, useDeletedPermanent, useDeletedResult, useUpdated, useUpdatedResult } from '../../hook/useCRUD'
import { useClickOutside } from '../../hook/useClickOutside'
import { useSelected } from '../../hook/useSelected'

export const QuoteActions = ({ sample, fetchData, accesData }) => {
	// Selección y control de modales
	const { selected, setSelected } = useSelected()
	const { dropdownVisible, toggleDropdown } = useDropdown()
	const dropdownRef = useClickOutside(() => toggleDropdown(null))

	// CRUD
	const { isVisible: showUpdatedModal, openModal: openUpdated, closeModal: closeUpdated } = useUpdated()
	const { isVisible: showAddResultModal, openModal: openAddResult, closeModal: closeAddResult } = useAddResult()
	const {
		isVisible: showUpdatedResultModal,
		openModal: openUpdatedResult,
		closeModal: closeUpdatedResult,
	} = useUpdatedResult()
	const {
		isVisible: showDeletedPermanentModal,
		openModal: openDeletedPermanent,
		closeModal: closeDeletedPermanent,
	} = useDeletedPermanent()

	const {
		isVisible: showDeletedResult,
		openModal: openDeletedResult,
		closeModal: closeDeletedResult,
	} = useDeletedResult()

	// TODO: no borrar parametro "data", si lo haces se rompe
	const handleOpenModal = (data, openModalFunc) => {
		setSelected(data)
		openModalFunc()
		toggleDropdown(null)
	}

	return (
		<>
			<div className='relative inline-block text-left' ref={dropdownRef}>
				<button
					className='p-2 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-600/50 dark:hover:text-gray-100 rounded-full transition-all ease-in-out duration-300'
					onClick={() => toggleDropdown(!dropdownVisible)}>
					{dropdownVisible ? (
						<BiDotsHorizontal className='text-lg transform transition-transform duration-500 ease-in-out' />
					) : (
						<BiDotsVertical className='text-lg transform transition-transform duration-500 ease-in-out' />
					)}
				</button>

				{dropdownVisible && (
					<div
						ref={dropdownRef}
						className='absolute right-0 mt-2 px-1 border dark:border-gray-600 w-max bg-white dark:bg-gray-800 rounded-xl shadow-lg z-10'>
						<ul className='py-1 text-xs space-y-0 text-slate-500 dark:text-gray-300 font-medium'>
							<li>
								<button
									className='flex items-center gap-2 w-full text-left p-2 hover:bg-slate-200 dark:hover:bg-gray-600/60 rounded-lg transition-all ease-in-out duration-200'
									onClick={() => handleOpenModal(sample, openUpdated)}>
									<BiSolidEditAlt size={14} />
									Editar muestra
								</button>
							</li>
							<li>
								{!sample?.result ? (
									<button
										className='flex items-center gap-2 w-full text-left p-2 hover:bg-slate-200 dark:hover:bg-gray-600/60 rounded-lg transition-all ease-in-out duration-200'
										onClick={() => handleOpenModal(sample, openAddResult)}>
										<BiSolidAddToQueue size={14} />
										Añadir resultado
									</button>
								) : (
									<button
										className='flex items-center gap-2 w-full text-left p-2 hover:bg-slate-200 dark:hover:bg-gray-600/60 rounded-lg transition-all ease-in-out duration-200'
										onClick={() => handleOpenModal(sample, openUpdatedResult)}>
										<BiSolidAddToQueue size={14} />
										Editar resultado
									</button>
								)}
							</li>

							<li>
								<button
									className='flex items-center gap-2 w-full text-left p-2 hover:bg-slate-200 dark:hover:bg-gray-600/60 rounded-lg transition-all ease-in-out duration-200'
									onClick={() => handleOpenModal(sample, openDeletedResult)}>
									<BiSolidTrash size={14} />
									Eliminar resultado
								</button>
							</li>

							<li>
								<button
									className='flex items-center gap-2 w-full text-left p-2 hover:bg-slate-200 dark:hover:bg-gray-600/60 rounded-lg transition-all ease-in-out duration-200'
									onClick={() => handleOpenModal(sample, openUpdated)}>
									<BiSolidDownload size={14} />
									Informe muestra
								</button>
							</li>

							<li>
								<button
									className='w-full text-left p-2 hover:bg-red-200 dark:hover:bg-red-400 flex items-center gap-2 rounded-lg dark:text-red-400 text-red-500 dark:hover:text-slate-900 transition-all ease-in-out duration-200'
									onClick={() => handleOpenModal(sample, openDeletedPermanent)}>
									<BiSolidTrash size={14} />
									Eliminar muestra
								</button>
							</li>
						</ul>
					</div>
				)}
			</div>

			{showUpdatedModal && (
				<ModalUpdate sample={selected} onClose={closeUpdated} onSuccess={fetchData} accesData={accesData} />
			)}

			{showAddResultModal && <ModalAddResult sample={selected} onClose={closeAddResult} onSuccess={fetchData} />}
			{showUpdatedResultModal && (
				<ModalUpdateResult sample={selected} onClose={closeUpdatedResult} onSuccess={fetchData} />
			)}

			{showDeletedPermanentModal && (
				<ModalDeletePermanent
					sample={selected}
					onClose={closeDeletedPermanent}
					onSuccess={fetchData}
					accesData={accesData}
				/>
			)}

			{showDeletedResult && <ModalDeleteResult sample={selected} onClose={closeDeletedResult} onSuccess={fetchData} />}
		</>
	)
}
