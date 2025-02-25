import { LuArchive } from 'react-icons/lu'
import { useAsignedLab } from '../../hook/useCRUD'
import { useDropdown } from '../../hook/useDropdown'
import { useSelected } from '../../hook/useSelected'
import { useAsignedaLabStore } from '../../hook/AsignedLab'
import { ModalasignedLab } from '../Form/Lab/AsignedLabCRUD'
import { Button } from '../../../../components/Button/Button'
import { NotFound } from '../../../../components/Banner/NotFound'
import { useRoles } from '../../../../helpers/roleControl.helper'
import { ROLES } from '../../../../helpers/constants.helper'

export const LabsCard = ({ quoteData }) => {
	const { loading, error, asignedLabData, fetchData } = useAsignedaLabStore(quoteData.id_quote)

	const { loading: loadingRoles, error: errorRoles, userRoles } = useRoles()

	// UTILS - MODALS
	const { selected, setSelected } = useSelected()
	const { dropdownVisible, toggleDropdown } = useDropdown()

	// CRUD
	const {
		isVisible: showAsignedLabModal,
		openModal: handleAsignedLab,
		closeModal: toggleAsignedLabModal,
	} = useAsignedLab()

	const handleOpenModal = (data, openModalFunc) => {
		setSelected(data)
		openModalFunc()
		toggleDropdown(null)
	}

	const assignedLabs = asignedLabData?.data?.asigned_labs ?? []

	return (
		<>
			<section>
				{loading && loadingRoles ? (
					<>
						<section className='col-span-1'>
							<div className='grid md:grid-cols-1 gap-4'>
								<div className='bg-slate-100 dark:bg-gray-700 p-4 h-20 w-full rounded-xl animate-pulse'></div>
								<div className='bg-slate-100 dark:bg-gray-700 p-4 h-20 w-full rounded-xl animate-pulse'></div>
								<div className='bg-slate-100 dark:bg-gray-700 p-4 h-20 w-full rounded-xl animate-pulse'></div>
							</div>
						</section>
					</>
				) : asignedLabData?.data?.totalRecords === 0 ? (
					<>
						<section className='col-span-1 py-20 space-y-10 '>
							<NotFound
								icon={<LuArchive size={50} />}
								title='Sin registros'
								description='Lo sentimos, no se encontró ningún laboratorio asignado.'
							/>
							<div className='mt-4 flex items-center justify-center'>
								{userRoles.some(userRole => userRole.type === ROLES.ACCESS_MANAGER) && (
									<Button variant='secondary' size='small' onClick={() => handleOpenModal(handleAsignedLab)}>
										Gestionar laboratorios
									</Button>
								)}
							</div>
						</section>
					</>
				) : (
					<>
						<section className='col-span-1'>
							<div className='flex justify-between pb-4 text-sm dark:text-gray-300 font-medium text-slate-600'>
								<span>Total ({asignedLabData?.data?.totalRecords})</span>
								{userRoles.some(userRole => userRole.type === ROLES.ACCESS_MANAGER) && (
									<Button variant='secondary' size='small' onClick={() => handleOpenModal(handleAsignedLab)}>
										Gestionar laboratorios
									</Button>
								)}
							</div>
						</section>

						<section className='max-h-96 overflow-y-auto dark:bg-gray-700/30 bg-slate-100 border dark:border-gray-700 rounded-lg p-2'>
							<table className='w-full border-collapse'>
								<thead className='text-gray-500 dark:text-gray-300'>
									<tr className='dark:text-gray-400 font-medium text-xs'>
										<th className='text-left p-2'>Laboratorio</th>
										<th className='text-left p-2'>Análista</th>
									</tr>
								</thead>
								<tbody>
									{assignedLabs.map(({ lab }) => {
										const isLabDeleted = lab?.deletedAt
										const isAnalystDeleted = lab?.laboratory_analyst?.user?.deletedAt
										return (
											<tr
												key={lab?.id_lab}
												className='hover:bg-slate-50 text-xs font-medium dark:hover:bg-gray-700 transition-colors dark:text-gray-300 text-slate-600 border-t dark:border-t-gray-700'>
												<td className={`p-2 line-clamp-2 ${isLabDeleted ? 'text-red-500 line-through' : ''}`}>
													{lab?.name}
												</td>

												<td className='p-2'>
													<span
														className={`break-words line-clamp-1 ${
															isAnalystDeleted ? 'text-red-500 line-through' : ''
														}`}>
														{lab?.laboratory_analyst?.user?.full_name ?? 'Sin responsable'}
													</span>
												</td>
											</tr>
										)
									})}
								</tbody>
							</table>
						</section>
					</>
				)}
			</section>

			{showAsignedLabModal && (
				<ModalasignedLab
					onClose={toggleAsignedLabModal}
					onSuccess={fetchData}
					quote={quoteData}
					assignedLabs={assignedLabs}
				/>
			)}
		</>
	)
}
