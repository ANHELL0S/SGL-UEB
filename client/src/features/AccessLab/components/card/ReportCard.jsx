import { LuArchive } from 'react-icons/lu'
import { ROLES } from '@/helpers/constants.helper'
import { useReportStore } from '../../hook/Report'
import { Button } from '@/components/Button/Button'
import { useDropdown } from '../../hook/useDropdown'
import { useSelected } from '../../hook/useSelected'
import { formatISOToDate } from '@/helpers/dateTimeZone.helper'
import { NotFound } from '../../../../components/Banner/NotFound'
import { useRoles } from '../../../../helpers/roleControl.helper'
import { useDeletedReport, useEmited, useNotEmited } from '../../hook/useCRUD'
import { BiSolidCheckCircle, BiSolidTrash, BiSolidXCircle } from 'react-icons/bi'
import { ModalDeletedReport, ModalEmitedReport, ModalNotEmitedReport } from '../Form/Report/ReportCRUD'

export const ReportCard = ({ accessData }) => {
	const { loading, error, reportData, fetchData } = useReportStore(accessData?.quote?.id_quote)

	const { loading: loadingRoles, error: errorRoles, userRoles } = useRoles()

	// UTILS - MODALS
	const { selected, setSelected } = useSelected()
	const { dropdownVisible, toggleDropdown } = useDropdown()

	// CRUD
	const { isVisible: showEmitedModal, openModal: handleEmited, closeModal: toggleEmitedModal } = useEmited()
	const { isVisible: showNotEmitedModal, openModal: handleNotEmited, closeModal: toggleNotEmitedModal } = useNotEmited()
	const { isVisible: showDeletedModal, openModal: handleDeleted, closeModal: toggleDeletedModal } = useDeletedReport()

	const handleOpenModal = (data, openModalFunc) => {
		setSelected(data)
		openModalFunc()
		toggleDropdown(null)
	}

	const emittedCount = reportData?.reports?.filter(report => report.isIssued).length || 0
	const notEmittedCount = reportData?.reports?.filter(report => !report.isIssued).length || 0

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
				) : reportData?.totalRecords === 0 ? (
					<>
						<section className='col-span-1 py-20 space-y-10 '>
							<NotFound
								icon={<LuArchive size={50} />}
								title='Sin registros'
								description='Lo sentimos, no se encontró ningún reporte.'
							/>
						</section>
					</>
				) : (
					<>
						<section className='col-span-1'>
							<div className='flex justify-between pb-4 items-center dark:text-gray-300 font-medium text-slate-600'>
								<div className='flex flex-col sm:flex-row gap-6 text-slate-600 dark:text-gray-300'>
									<span className='text-sm font-medium'>
										Total: <strong>{reportData?.totalRecords}</strong>
									</span>
								</div>
								<div className='flex flex-col sm:flex-row gap-6 text-slate-600 dark:text-gray-300'>
									<span className='text-sm font-medium'>
										Emitidas: <strong>{emittedCount}</strong>
									</span>
									<span className='text-sm font-medium'>
										No emitidas: <strong>{notEmittedCount}</strong>
									</span>
								</div>
							</div>
						</section>

						<section className='max-h-96 overflow-y-auto  dark:bg-gray-700/30 bg-slate-100 border dark:border-gray-700 rounded-lg p-2'>
							<table className='w-full border-collapse'>
								<thead className='text-gray-500 dark:text-gray-300'>
									<tr className='dark:text-gray-400 font-medium text-xs'>
										<th className='text-left p-2'>#</th>
										<th className='text-left p-2'>Código</th>
										<th className='text-left p-2'>Responsable(s)</th>
										<th className='text-left p-2'>Muestra</th>
										<th className='text-left p-2'>Estado</th>
										<th className='text-left p-2'>Creado</th>
										{userRoles.some(userRole => userRole.type !== ROLES.DIRECTOR) && (
											<th className='text-left p-2'>Acción</th>
										)}
									</tr>
								</thead>
								<tbody>
									{reportData?.reports?.map(report => {
										const isReportDeleted = report.deletedAt
										const isSeniorAnalystDeleted = report.senior_analyst?.deletedAt
										const isCollaboratingAnalystDeleted = report.collaborating_analyst?.deletedAt

										return (
											<tr
												key={report.id_report}
												className={`hover:bg-slate-50 text-xs font-medium dark:hover:bg-gray-700/20 transition-colors dark:text-gray-300 text-slate-600 border-t dark:border-t-gray-700 ${isReportDeleted ? 'text-red-500 line-through' : ''}`}>
												<td className='p-2'>{report.number}</td>
												<td className='p-2'>{report.code}</td>
												<td className='p-2'>
													<span
														className={`${isCollaboratingAnalystDeleted ? 'text-red-500 line-through' : ''} ${isSeniorAnalystDeleted ? 'text-red-500 line-through' : ''}`}>
														{report.senior_analyst?.code}
														{report?.collaborating_analyst?.code && <> • {report.collaborating_analyst?.code}</>}
													</span>
												</td>
												<td className='p-2'>{report.sample.name}</td>
												<td
													className={`font-semibold p-2 ${
														report?.isIssued ? 'dark:text-teal-400 text-teal-500' : 'dark:text-red-400 text-red-500'
													}`}>
													{report?.isIssued ? 'Emitido' : 'No emitido'}
												</td>
												<td className='p-2'>{formatISOToDate(report.createdAt)}</td>
												{userRoles.some(userRole => userRole.type !== ROLES.DIRECTOR) && (
													<td className='flex items-center justify-center'>
														{report?.isIssued ? (
															<Button
																variant='none'
																size='small'
																onClick={() => handleOpenModal(report, handleNotEmited)}>
																<BiSolidXCircle size={14} className='text-orange-400' />
															</Button>
														) : (
															<Button variant='none' size='small' onClick={() => handleOpenModal(report, handleEmited)}>
																<BiSolidCheckCircle size={14} className='text-emerald-400' />
															</Button>
														)}
														<Button variant='none' size='small' onClick={() => handleOpenModal(report, handleDeleted)}>
															<BiSolidTrash className='text-red-400' size={14} />
														</Button>
													</td>
												)}
											</tr>
										)
									})}
								</tbody>
							</table>
						</section>
					</>
				)}
			</section>

			{showEmitedModal && <ModalEmitedReport report={selected} onClose={toggleEmitedModal} onSuccess={fetchData} />}
			{showNotEmitedModal && (
				<ModalNotEmitedReport report={selected} onClose={toggleNotEmitedModal} onSuccess={fetchData} />
			)}
			{showDeletedModal && <ModalDeletedReport report={selected} onClose={toggleDeletedModal} onSuccess={fetchData} />}
		</>
	)
}
