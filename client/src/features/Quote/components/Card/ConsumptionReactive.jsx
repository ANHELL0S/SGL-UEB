import { useCreateConsumption, useDeleteConsumption } from '../../hook/useCRUD'
import { ModalCreateConsumption, ModalDeleteConsumption } from '../Form/Consumption/ConsumptionCRUD'
import { Button } from '../../../../components/Button/Button'
import { useAllConsumptionPertainToAccessStore } from '../../../../hooks/useConsumptionReactive'
import { NotFound } from '../../../../components/Banner/NotFound'
import { LuArchive } from 'react-icons/lu'
import { BiSolidCalendarAlt, BiSolidTrash } from 'react-icons/bi'
import { useSelected } from '../../hook/useSelected'
import { useDropdown } from '../../../Quote/hook/useDropdown'
import { formatISOToDate } from '../../../../helpers/dateTimeZone.helper'

export const ConsumptionReactive = ({ quoteData }) => {
	const {
		loading,
		error,
		page,
		limit,
		search,
		setSearch,
		fetchConsumption,
		handleKeyDown,
		handleSearchChange,
		handleLimitChange,
		handlePageChange,
		totalRecords,
		totalPages,
		consumptionData,
	} = useAllConsumptionPertainToAccessStore(quoteData?.id_quote)

	// UTILS FOR MODALS
	const { selected, setSelected } = useSelected()
	const { dropdownVisible, toggleDropdown } = useDropdown()

	// CRUD
	const {
		isVisible: showCreatedModal,
		openModal: handleCreated,
		closeModal: toggleCreatedModal,
	} = useCreateConsumption()
	const {
		isVisible: showDeletedPermanentModal,
		openModal: handleDeletedPermanent,
		closeModal: toggleDeletedPermanentModal,
	} = useDeleteConsumption()

	// TODO: no borrar parametro "data", si lo haces se rompe
	const handleOpenModal = (data, openModalFunc) => {
		setSelected(data)
		openModalFunc()
		toggleDropdown(null)
	}

	return (
		<>
			{loading ? (
				<section className='col-span-1'>
					<div className='grid md:grid-cols-1 gap-4'>
						<div className='bg-slate-100 dark:bg-gray-700 p-4 h-20 w-full rounded-xl animate-pulse'></div>
					</div>
				</section>
			) : consumptionData.length === 0 ? (
				<section className='col-span-1 py-20 space-y-10 '>
					<NotFound
						icon={<LuArchive size={50} />}
						title='Sin registros'
						description='Lo sentimos, no se encontró ningún consumo.'
					/>

					<div className='mt-4 flex items-center justify-center'>
						<Button variant='secondary' size='small' onClick={() => handleCreated()}>
							Regitrar consumo
						</Button>
					</div>
				</section>
			) : (
				<section className='col-span-1'>
					<div className='flex justify-between pb-4 dark:text-gray-300 font-medium text-slate-600 text-sm'>
						<span>Total ({totalRecords})</span>
						<Button variant='secondary' size='small' onClick={() => handleCreated()}>
							Regitrar consumo
						</Button>
					</div>

					<div className='grid sm:grid-cols-1 md:grid-cols-1 gap-3 text-xs dark:bg-gray-700/30 bg-slate-100 border dark:border-gray-700 rounded-lg p-2'>
						<table className='w-full border-collapse'>
							<thead className='text-gray-500 dark:text-gray-300'>
								<tr className='dark:text-gray-400 font-medium'>
									<th className='text-left p-2'>Reactivo</th>
									<th className='text-left p-2'>Cnt</th>
									<th className='text-left p-2'>Resp</th>
									<th className='text-left p-2'>Laboratorio</th>
									<th className='text-left p-2'>Fecha</th>
									<th className='text-left p-2'>Acción</th>
								</tr>
							</thead>

							<tbody>
								{consumptionData.map(sample => (
									<tr
										key={sample.id_sample}
										className='hover:bg-slate-50 font-medium dark:hover:bg-gray-700/30 transition-colors dark:text-gray-300 text-slate-600 border-t dark:border-t-gray-700'>
										<td
											className={`p-2 ${
												sample?.reactive?.deletedAt ? 'line-through text-red-500' : 'text-gray-700 dark:text-gray-200'
											}`}>
											{sample?.reactive?.name}
										</td>
										<td className='p-2'>
											{parseFloat(sample?.amount).toString()} {sample?.reactive?.units_measurement?.unit}
										</td>
										<td
											className={`p-2 ${
												sample?.user?.deletedAt ? 'line-through text-red-500' : 'text-gray-700 dark:text-gray-200'
											}`}>
											{sample?.user?.code}
										</td>
										<td className='p-2 text-xs'>{sample?.lab?.name}</td>
										<td className='p-2'>
											<span>{formatISOToDate(sample.createdAt)}</span>
										</td>
										<td className='p-2'>
											<Button
												variant='none'
												size='small'
												onClick={() => handleOpenModal(sample, handleDeletedPermanent)}>
												<BiSolidTrash className='text-red-400' />
											</Button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</section>
			)}

			{showCreatedModal && (
				<ModalCreateConsumption onClose={toggleCreatedModal} onSuccess={fetchConsumption} quoteData={quoteData} />
			)}
			{showDeletedPermanentModal && (
				<ModalDeleteConsumption
					onClose={toggleDeletedPermanentModal}
					consumption={selected}
					onSuccess={fetchConsumption}
					quoteData={quoteData}
				/>
			)}
		</>
	)
}
