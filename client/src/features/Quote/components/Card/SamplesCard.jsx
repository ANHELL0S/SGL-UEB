import { Banner } from '../Banner/Banner'
import { LuArchive } from 'react-icons/lu'
import { useDropdown } from '../../hook/useDropdown'
import { useSelected } from '../../hook/useSelected'
import { useSampleToQuote } from '../../hook/SampleQuote'
import { Button } from '../../../../components/Button/Button'
import { QuoteActionsSample } from '../dropdown/DropdpwnSamples'
import { NotFound } from '../../../../components/Banner/NotFound'
import { formatISOToDate } from '../../../../helpers/dateTimeZone.helper'
import { BiSolidCalendarAlt, BiSolidEditAlt, BiSolidInfoCircle, BiSolidTrash, BiSolidTrashAlt } from 'react-icons/bi'
import { useCreatedSample, useCreateResult, useDeletedResult, useUpdatedResult } from '../../hook/useCRUD'
import { ModalCreateResult, ModalCreateSample, ModalDeleteResult, ModalUpdateResult } from '../Form/Sample/SampleCRUD'

export const SamplesCard = ({ quoteData }) => {
	const { error, loading, fetchSamples, sampleQuoteData } = useSampleToQuote(quoteData?.id_quote)

	// UTILS - MODALS
	const { selected, setSelected } = useSelected()
	const { dropdownVisible, toggleDropdown } = useDropdown()

	// CRUD
	const {
		isVisible: showCreatedSampleModal,
		openModal: handleCreatedSample,
		closeModal: toggleCreatedSampleModal,
	} = useCreatedSample()
	const { isVisible: showAddResultModal, openModal: openAddResult, closeModal: closeAddResult } = useCreateResult()
	const {
		isVisible: showUpdatedResultModal,
		openModal: openUpdatedResult,
		closeModal: closeUpdatedResult,
	} = useUpdatedResult()
	const {
		isVisible: showDeletedResult,
		openModal: openDeletedResult,
		closeModal: closeDeletedResult,
	} = useDeletedResult()

	const handleOpenModal = (data, openModalFunc) => {
		setSelected(data)
		openModalFunc()
		toggleDropdown(null)
	}

	const messages = ['Aún no has añadido un resultado.']

	// Calcular total de resultados de todas las muestras
	const totalResults = sampleQuoteData?.samples?.reduce((acc, sample) => acc + (sample.results?.length || 0), 0)

	return (
		<>
			<section>
				{loading ? (
					<section className='col-span-1'>
						<div className='grid md:grid-cols-1 gap-4'>
							<div className='bg-slate-100 dark:bg-gray-700 p-3 h-24 w-full rounded-md animate-pulse' />
							<div className='bg-slate-100 dark:bg-gray-700 p-3 h-24 w-full rounded-md animate-pulse' />
							<div className='bg-slate-100 dark:bg-gray-700 p-3 h-24 w-full rounded-md animate-pulse' />
						</div>
					</section>
				) : error ? (
					<div className='flex justify-center py-20'>
						<NotFound
							icon={<BiSolidInfoCircle size={50} />}
							title={`${error.status} ${error.code}`}
							description={error.message}
						/>
					</div>
				) : sampleQuoteData?.totalRecords === 0 ? (
					<section className='col-span-1 py-20 space-y-10'>
						<NotFound
							icon={<LuArchive size={50} />}
							title='Sin registros'
							description='Lo sentimos, no se encontró ninguna muestra.'
						/>
						<div className='mt-4 flex items-center justify-center'>
							<Button variant='secondary' size='small' onClick={() => handleOpenModal(null, handleCreatedSample)}>
								Nueva muestra
							</Button>
						</div>
					</section>
				) : (
					<>
						{/* Cabecera con métricas */}
						<section className='mb-4'>
							<div className='flex flex-wrap items-center justify-between'>
								<div className='flex flex-col sm:flex-row gap-6 text-slate-600 dark:text-gray-300'>
									<span className='text-sm font-medium'>
										Muestras: <strong>{sampleQuoteData.totalRecords}</strong>
									</span>
									<span className='text-sm font-medium'>
										Resultados: <strong>{totalResults}</strong>
									</span>
								</div>
								<Button variant='secondary' size='small' onClick={() => handleOpenModal(null, handleCreatedSample)}>
									Nueva muestra
								</Button>
							</div>
						</section>

						{/* Lista de muestras */}
						<div className='grid gap-4 h-screen overflow-auto'>
							{sampleQuoteData?.samples?.map(sample => (
								<div
									key={sample.id_sample}
									className='bg-white dark:bg-gray-700/40 border dark:border-gray-700 p-3 rounded-lg text-gray-600 dark:text-gray-300 text-sm'>
									<div className='flex items-center justify-between'>
										<div className='flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400'>
											<BiSolidCalendarAlt />
											<span>{formatISOToDate(sample.createdAt)}</span>
										</div>
										<QuoteActionsSample sample={sample} fetchData={fetchSamples} quoteData={quoteData} />
									</div>

									<h3 className='text-base font-semibold'>{sample.name}</h3>

									{/* Detalles de la muestra en formato de badges */}
									<div className='flex flex-wrap gap-2 mt-2 text-xs font-medium'>
										<span className='px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded'>
											Cantidad:{' '}
											<strong>
												{sample.amount} {sample?.unit_measurement?.unit}
											</strong>
										</span>

										<span className='px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded'>
											Contenedor: <strong>{sample.container}</strong>
										</span>
										<span className='px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded'>
											Estado: <strong>{sample.status}</strong>
										</span>
									</div>

									<div className='flex pt-3 text-xs font-medium'>
										<span>
											Recepción por: <strong>{sample?.user?.code}</strong>
										</span>
									</div>

									<hr className='my-3 dark:border-gray-700' />

									{/* Sección de resultados */}
									<div>
										<div className='flex items-center justify-between pb-1'>
											<h2 className='text-sm font-semibold'>Resultados ({sample?.results?.length || 0})</h2>
											<Button variant='secondary' size='small' onClick={() => handleOpenModal(sample, openAddResult)}>
												Nuevo resultado
											</Button>
										</div>

										{sample?.results && sample.results.length > 0 ? (
											<div className='overflow-auto mt-2'>
												<table className='min-w-full text-xs table-auto'>
													<thead className='bg-gray-200 dark:bg-gray-700'>
														<tr>
															<th className='px-2.5 py-1 text-left'>Cod</th>
															<th className='px-2.5 py-1 text-left'>Análisis</th>
															<th className='px-2.5 py-1 text-left'>Resultado</th>
															<th className='px-2.5 py-1 text-left'>Análista</th>
															<th className='px-2.5 py-1 text-left'>Fecha</th>
															<th className='px-2.5 py-1 text-left'></th>
														</tr>
													</thead>
													<tbody>
														{[...sample.results]
															.sort(
																(b, a) =>
																	parseInt(a.result.code_assigned_ueb, 10) - parseInt(b.result.code_assigned_ueb, 10)
															)
															.map(({ result }) => (
																<tr key={result.id_sample_result} className='border-t dark:border-gray-700'>
																	<td className='px-2.5 py-1 truncate'>INV {result.code_assigned_ueb}</td>
																	<td className='px-2.5 py-1'>
																		<div
																			className={`${
																				result?.experiments_parameter?.deletedAt ? 'line-through text-red-400' : ''
																			}`}>
																			{result?.experiments_parameter?.name || '---'}
																		</div>
																		<div
																			className={`${
																				result?.experiments_parameter?.experiments_category?.deletedAt
																					? 'line-through text-red-400'
																					: ''
																			} text-xs`}>
																			<strong>Categoria: </strong>
																			{result?.experiments_parameter?.experiments_category?.name || '---'}
																		</div>
																	</td>
																	<td className='px-2.5 py-1'>{result.result}</td>
																	<td className='px-2.5 py-1'>{result?.user?.code}</td>
																	<td className='px-2.5 py-1 truncate'>{formatISOToDate(result.createdAt)}</td>
																	<td className='px-2.5 py-1 flex items-center'>
																		<Button
																			variant='none'
																			size='small'
																			onClick={() => handleOpenModal(result, openUpdatedResult)}>
																			<BiSolidEditAlt />
																		</Button>
																		<Button
																			variant='none'
																			size='small'
																			onClick={() => handleOpenModal(result, openDeletedResult)}>
																			<BiSolidTrash className='text-red-400' />
																		</Button>
																	</td>
																</tr>
															))}
													</tbody>
												</table>
											</div>
										) : (
											<Banner messages={messages} type='warning' className='mt-2' />
										)}
									</div>
								</div>
							))}
						</div>
					</>
				)}
			</section>

			{/* Modales */}
			{showCreatedSampleModal && (
				<ModalCreateSample onClose={toggleCreatedSampleModal} onSuccess={fetchSamples} quoteData={quoteData} />
			)}
			{showAddResultModal && (
				<ModalCreateResult sample={selected} onClose={closeAddResult} onSuccess={fetchSamples} quoteData={quoteData} />
			)}
			{showUpdatedResultModal && (
				<ModalUpdateResult
					sample={selected}
					onClose={closeUpdatedResult}
					onSuccess={fetchSamples}
					quoteData={quoteData}
				/>
			)}
			{showDeletedResult && (
				<ModalDeleteResult sample={selected} onClose={closeDeletedResult} onSuccess={fetchSamples} />
			)}
		</>
	)
}
