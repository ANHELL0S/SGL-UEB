import { LuArchive } from 'react-icons/lu'
import { useCreatedAnalysis, useDeletedAnalysis, useUpdatedAnalysis } from '../../hook/useCRUD'
import { useDropdown } from '../../hook/useDropdown'
import { useSelected } from '../../hook/useSelected'
import { useAnalysisStore } from '../../hook/Analysis'
import { ROLES } from '../../../../helpers/constants.helper'
import { Button } from '../../../../components/Button/Button'
import { NotFound } from '../../../../components/Banner/NotFound'
import { useRoles } from '../../../../helpers/roleControl.helper'
import { BiSolidEditAlt, BiSolidTrashAlt } from 'react-icons/bi'
import { ModalCreatedAsignedAnalysis } from '../Form/Analysis/AsignedAnalysisCRUD'

export const AnalysisCard = ({ accessData }) => {
	const { loading, error, analysisData, fetchData } = useAnalysisStore(accessData.id_access)

	const { loading: loadingRoles, error: errorRoles, userRoles } = useRoles()

	// UTILS - MODALS
	const { selected, setSelected } = useSelected()
	const { dropdownVisible, toggleDropdown } = useDropdown()

	// CRUD
	const {
		isVisible: showCreatedAsignedAnalysisModal,
		openModal: handleCreatedAsignedAnalysisLab,
		closeModal: toggleCreatedAsignedAnalysisModal,
	} = useCreatedAnalysis()

	const handleOpenModal = (data, openModalFunc) => {
		setSelected(data)
		openModalFunc()
		toggleDropdown(null)
	}

	const assignedLabs = analysisData?.data?.analysis ?? []

	return (
		<>
			<section>
				{loading && loadingRoles ? (
					<>
						<section className='col-span-1'>
							<div className='grid md:grid-cols-1 gap-4'>
								<div className='bg-slate-100 dark:bg-gray-700 p-4 h-4 w-full rounded-xl animate-pulse'></div>
								<div className='bg-slate-100 dark:bg-gray-700 p-4 h-4 w-full rounded-xl animate-pulse'></div>
								<div className='bg-slate-100 dark:bg-gray-700 p-4 h-4 w-full rounded-xl animate-pulse'></div>
							</div>
						</section>
					</>
				) : analysisData?.data?.totalRecords === 0 ? (
					<>
						<section className='col-span-1 py-20 space-y-10 dark:bg-gray-700/30 rounded-lg'>
							<NotFound
								icon={<LuArchive size={50} />}
								title='Sin registros'
								description='Lo sentimos, no se encontró ningún análisis.'
							/>
							<div className='mt-4 flex items-center justify-center'>
								<Button
									variant='secondary'
									size='small'
									onClick={data => handleOpenModal(data, handleCreatedAsignedAnalysisLab)}>
									Gestionar análisis
								</Button>
							</div>
						</section>
					</>
				) : (
					<>
						<section className='col-span-1'>
							<div className='flex justify-between pb-4 dark:text-gray-300 font-bold text-lg text-slate-600'>
								<span>Análisis ({analysisData?.data?.totalRecords})</span>
								{userRoles.some(userRole => userRole.type === ROLES.ACCESS_MANAGER) && (
									<Button
										variant='secondary'
										size='small'
										onClick={() => handleOpenModal(handleCreatedAsignedAnalysisLab)}>
										Gestionar análisis
									</Button>
								)}
							</div>
						</section>

						<section className='max-h-screen overflow-y-auto dark:bg-gray-700/30 bg-slate-100 border dark:border-gray-700 rounded-lg p-2'>
							<table className='w-full border-collapse'>
								<thead className='text-gray-500 dark:text-gray-300'>
									<tr className='dark:text-gray-400 font-medium text-xs'>
										<th className='text-left p-2'>Nombre</th>
										<th className='text-left p-2'>Categoría</th>
										<th className='text-left p-2'>Cnt</th>
									</tr>
								</thead>
								<tbody>
									{assignedLabs?.map(({ id_access_analysis, analysis, amount, deletedAt: accessDeletedAt }) => {
										const isAnalysisDeleted = analysis?.deletedAt || accessDeletedAt
										return (
											<tr
												key={id_access_analysis}
												className='text-xs font-medium transition-colors dark:text-gray-300 text-slate-600 border-t dark:border-t-gray-700'>
												<td className={`p-2 line-clamp-2 ${isAnalysisDeleted ? 'text-red-500 line-through' : ''}`}>
													{analysis?.name}
												</td>
												<td className='p-2'>
													<span
														className={`break-words line-clamp-1 ${
															isAnalysisDeleted ? 'text-red-500 line-through' : ''
														}`}>
														{analysis?.experiments_category?.name ?? 'Sin categoría'}
													</span>
												</td>
												<td className='p-2'>{amount}</td>
											</tr>
										)
									})}
								</tbody>
							</table>
						</section>
					</>
				)}
			</section>

			{showCreatedAsignedAnalysisModal && (
				<ModalCreatedAsignedAnalysis
					onClose={toggleCreatedAsignedAnalysisModal}
					onSuccess={fetchData}
					access={accessData}
					analysisData={analysisData}
				/>
			)}
		</>
	)
}
