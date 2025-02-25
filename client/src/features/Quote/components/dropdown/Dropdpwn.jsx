import {
	BiSolidCircle,
	BiDotsVertical,
	BiSolidXCircle,
	BiSolidEditAlt,
	BiDotsHorizontal,
	BiSolidCheckCircle,
} from 'react-icons/bi'
import { useDropdown } from '../../hook/useDropdown'
import { ROLES } from '../../../../helpers/constants.helper'
import { useClickOutside } from '../../hook/useClickOutside'
import { useRoles } from '../../../../helpers/roleControl.helper'
import { useApproved, usePending, useRejected, useUpdated } from '../../hook/useCRUD'
import { ModalApproved, ModalPending, ModalRejected, ModalUpdate } from '../Form/QuoteCRUD'

export const QuoteActions = ({ quoteData, fetchQuoteData }) => {
	const { loading: loadingRoles, error: errorRoles, userRoles } = useRoles()

	// Selección y control de modales
	const { dropdownVisible, toggleDropdown } = useDropdown()
	const dropdownRef = useClickOutside(() => toggleDropdown(null))

	// CRUD
	const { isVisible: showUpdatedModal, openModal: openUpdated, closeModal: closeUpdated } = useUpdated()
	const { isVisible: showApprovedModal, openModal: openApproved, closeModal: closeApproved } = useApproved()
	const { isVisible: showPendingModal, openModal: openPending, closeModal: closePending } = usePending()
	const { isVisible: showRejectedModal, openModal: openRejected, closeModal: closeRejected } = useRejected()

	// TODO: no borrar parametro "data", si lo haces se rompe
	const handleOpenModal = (data, openModalFunc) => {
		openModalFunc()
		toggleDropdown(null)
	}

	return (
		<>
			<div className='relative inline-block text-left' ref={dropdownRef}>
				{userRoles.some(userRole => userRole.type === ROLES.ACCESS_MANAGER || userRole.type === ROLES.DIRECTOR) && (
					<button
						className='p-2 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-600/50 dark:hover:text-gray-100 rounded-full transition-all ease-in-out duration-300'
						onClick={() => toggleDropdown(!dropdownVisible)}>
						{dropdownVisible ? (
							<BiDotsHorizontal className='text-lg transform transition-transform duration-500 ease-in-out' />
						) : (
							<BiDotsVertical className='text-lg transform transition-transform duration-500 ease-in-out' />
						)}
					</button>
				)}

				{dropdownVisible && (
					<div
						ref={dropdownRef}
						className='absolute right-2 mt-2 px-1 border dark:border-gray-600 w-max bg-white dark:bg-gray-800 rounded-xl shadow-lg z-10'>
						<ul className='py-1 text-xs space-y-0 text-slate-500 dark:text-gray-300 font-medium'>
							{userRoles.some(userRole => userRole.type === ROLES.ACCESS_MANAGER) && (
								<li>
									<button
										className='flex items-center gap-2 w-full text-left p-2 hover:bg-slate-200 dark:hover:bg-gray-600/60 rounded-lg transition-all ease-in-out duration-200'
										onClick={() => handleOpenModal(quoteData, openUpdated)}>
										<BiSolidEditAlt size={14} />
										Editar cotización
									</button>
								</li>
							)}

							{userRoles.some(userRole => userRole.type === ROLES.DIRECTOR) && (
								<>
									<li>
										<button
											className='dark:text-emerald-300 flex items-center gap-2 w-full text-left p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-all ease-in-out duration-200'
											onClick={() => handleOpenModal(quoteData, openApproved)}>
											<BiSolidCheckCircle size={14} /> Aprobar cotización
										</button>
									</li>
									<li>
										<button
											className='dark:text-amber-300 flex items-center gap-2 w-full text-left p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-all ease-in-out duration-200'
											onClick={() => handleOpenModal(quoteData, openPending)}>
											<BiSolidCircle size={14} /> Pendiente cotización
										</button>
									</li>
									<li>
										<button
											className='dark:text-red-400 flex items-center gap-2 w-full text-left p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-all ease-in-out duration-200'
											onClick={() => handleOpenModal(quoteData, openRejected)}>
											<BiSolidXCircle size={14} /> Rechazar cotización
										</button>
									</li>
								</>
							)}
						</ul>
					</div>
				)}
			</div>

			{showUpdatedModal && <ModalUpdate quote={quoteData} onClose={closeUpdated} onSuccess={fetchQuoteData} />}
			{showApprovedModal && <ModalApproved quote={quoteData} onClose={closeApproved} onSuccess={fetchQuoteData} />}
			{showPendingModal && <ModalPending quote={quoteData} onClose={closePending} onSuccess={fetchQuoteData} />}
			{showRejectedModal && <ModalRejected quote={quoteData} onClose={closeRejected} onSuccess={fetchQuoteData} />}
		</>
	)
}
