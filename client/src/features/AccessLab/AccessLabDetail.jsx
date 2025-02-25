import { Link, useLocation } from 'react-router-dom'
import { useAccessByCodeQuoteStore } from '../../hooks/useAccessLab'
import { Status500 } from '../../components/Banner/StatusServer'
import {
	BiSolidCalendarAlt,
	BiSolidArch,
	BiSolidIdCard,
	BiSolidEnvelope,
	BiSolidCheckShield,
	BiSolidTime,
	BiEditAlt,
	BiSolidTrashAlt,
} from 'react-icons/bi'
import Avvvatars from 'avvvatars-react'
import { LuArrowLeft } from 'react-icons/lu'
import { PATH_PRIVATE } from '../../helpers/constants.helper'
import { formatISOToDate } from '../../helpers/dateTimeZone.helper'
import { MembershipCard } from './components/card/Membership'
import { NotFoundSection } from '../404/404'
import { ConsumptionReactive } from './components/card/ConsumptionReactive'
import { SamplesCard } from './components/card/Samples'
import { useState } from 'react'
import { Button } from '../../components/Button/Button'
import { useSelected } from './hook/useSelected'
import { useAddApplicant, useDeletedApplicant, useUpdatedApplicant } from './hook/useCRUD'
import { ModalAddAplicant, ModalDeletePermanent, ModalUpdateApplicant } from './components/Form/Applicant/ApplicantCRUD'
import { useRoles } from '../../helpers/roleControl.helper'
import { ROLES } from '../../helpers/constants.helper'
import { ReportCard } from './components/card/ReportCard'

export const AccessLabDetailSection = () => {
	const location = useLocation()
	const accessCode = location.pathname.split('/').pop()
	const { accessData, loading, error, reloadAccess } = useAccessByCodeQuoteStore(accessCode)
	const { loading: loadingRoles, error: errorRoles, userRoles } = useRoles()

	const [activeTab, setActiveTab] = useState('membership')
	const handleTabClick = tab => setActiveTab(tab)

	// UTILS - MODALS
	const { selected, setSelected } = useSelected()

	// CRUD
	const {
		isVisible: showAddApplicantModal,
		openModal: handleAddApplicant,
		closeModal: toggleAddApplicantModal,
	} = useAddApplicant()
	const {
		isVisible: showUpdatedApplicantModal,
		openModal: handleUpdatedApplicant,
		closeModal: toggleUpdatedApplicantModal,
	} = useUpdatedApplicant()
	const {
		isVisible: showDeletedApplicantModal,
		openModal: handleDeletedApplicant,
		closeModal: toggleDeletedApplicantModal,
	} = useDeletedApplicant()

	// TODO: no borrar parametro "data", si lo haces se rompe
	const handleOpenModal = (data, openModalFunc) => {
		setSelected(data)
		openModalFunc()
	}

	if (error) {
		if (error?.code === 404) return <NotFoundSection />
		return <Status500 text={error} />
	}
	if (accessData?.deletedAt) return <NotFoundSection />

	return (
		<>
			<main class='grid md:grid-cols-7 gap-10'>
				{loading && loadingRoles ? (
					<section className='col-span-3'>
						<div className='space-y-6'>
							<div className='space-y-6'>
								{/* Header Skeleton */}
								<div className='flex items-center gap-4 justify-start'>
									<div className='w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse'></div>
									<div className='h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded animate-pulse'></div>
								</div>

								<div className='space-y-8'>
									{/* Date and STATUS/TYPE Skeleton */}
									<div className='space-y-4 pt-2'>
										<div className='flex items-center justify-between'>
											<div className='w-32 h-5 bg-gray-300 dark:bg-gray-600 rounded-lg'></div>
											<div className='flex gap-2 text-sm'>
												<div className='w-16 h-6 bg-gray-300 dark:bg-gray-600 rounded-full'></div>
												<div className='w-16 h-6 bg-gray-300 dark:bg-gray-600 rounded-full'></div>
											</div>
										</div>
										<div className='space-y-2'>
											<div className='w-40 h-5 bg-gray-300 dark:bg-gray-600 rounded-lg'></div>
											<div className='w-full h-5 bg-gray-300 dark:bg-gray-600 rounded-lg'></div>
										</div>
										<div className='space-y-2'>
											<div className='w-40 h-5 bg-gray-300 dark:bg-gray-600 rounded-lg'></div>
											<div className='w-full h-5 bg-gray-300 dark:bg-gray-600 rounded-lg'></div>
										</div>
										<div className='space-y-1'>
											<div className='w-40 h-full bg-gray-300 dark:bg-gray-600 rounded-lg'></div>
											<div className='w-full h-36 bg-gray-300 dark:bg-gray-600 rounded-lg'></div>
										</div>
									</div>

									<div className='grid grid-cols-1 gap-6 items-center'>
										{/* CARD TIME - REASON */}
										<div className='grid col-span-4 w-full h-14 gap-4 text-sm bg-white dark:bg-gray-600 rounded-full p-3'></div>

										{/* CARD FACULTY - CAREER */}
										<div className='grid col-span-5 gap-4 w-full h-14 text-sm p-3 rounded-lg dark:bg-gray-600'></div>
									</div>
								</div>

								<div className='space-y-8'>
									<div className='grid col-span-5 gap-4 w-full h-28 text-sm p-3 rounded-lg dark:bg-gray-600'></div>
								</div>
							</div>
						</div>
					</section>
				) : (
					<section class='sm:col-span-3 col-span-4'>
						<div className='space-y-6'>
							<div className='space-y-6'>
								<div className='flex items-center gap-4 justify-start'>
									<Link
										to={PATH_PRIVATE.LAB_ACCESS}
										className='dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-300 p-2 rounded-full hover:bg-gray-300 bg-slate-200 text-slate-500 transition-all ease-linear duration-300'>
										<LuArrowLeft />
									</Link>

									<div className='flex gap-2 text-2xl font-semibold text-slate-600 dark:text-neutral-200 break-words line-clamp-1'>
										<span>{accessData?.code}</span>
									</div>
								</div>

								<div className='space-y-4'>
									<div className='flex items-center justify-between'>
										<p className='text-sm font-medium text-slate-500 dark:text-gray-400 flex items-center gap-1'>
											<BiSolidCalendarAlt />
											Creado el {formatISOToDate(accessData?.createdAt)}
										</p>

										<div className='flex gap-2 text-xs'>
											<span
												className={`font-semibold px-2 py-0.5 rounded-full ${
													{
														Aprobado: 'dark:text-emerald-300 dark:bg-emerald-700/50 bg-emerald-100 text-emerald-500',
														Pendiente: 'dark:text-yellow-300 dark:bg-yellow-700/50 bg-yellow-100 text-yellow-500',
														Rechazado: 'dark:text-red-300 dark:bg-red-700/50 bg-red-100 text-red-500',
													}[accessData?.status]
												}`}>
												{accessData?.status}
											</span>
										</div>
									</div>

									<div className='space-y-2'>
										<p className='text-base flex items-center gap-1 font-medium text-emerald-500 dark:text-emerald-300 uppercase'>
											<BiSolidCheckShield />
											<span>{accessData?.resolution_approval}</span>
										</p>
										<p className='text-base font-medium text-slate-500 dark:text-gray-200 uppercase'>
											{accessData?.topic}
										</p>
									</div>
								</div>

								<div className='space-y-8 h-screen overflow-auto'>
									<div className='space-y-1'>
										<p className='text-sm font-medium text-slate-500 dark:text-gray-300/85'>
											<strong>Observación: </strong>
											{accessData?.observations}
										</p>
										<p className='text-sm font-medium text-slate-500 dark:text-gray-300/85 break-words line-clamp-6'>
											<strong>Clausulas: </strong>
											{accessData?.clauses}
										</p>
									</div>

									<div className='grid grid-cols-1 gap-6 items-center'>
										{/* CARD TIME - REASON */}
										<div className='grid col-span-12 gap-4 text-sm bg-sky-100 rounded-full p-3'>
											<div className='text-gray-700 space-y-3 font-medium'>
												<div className='flex gap-3 items-center text-sm'>
													<BiSolidTime size={35} />
													<div className='flex flex-col'>
														<span className='break-words line-clamp-2'>
															<strong>Motivo: </strong>
															{accessData?.reason}
														</span>
														<div>
															<strong>Permancenia: </strong>
															<span>
																{accessData?.datePermanenceStart} a {accessData?.datePermanenceEnd}
															</span>
														</div>
													</div>
												</div>
											</div>
										</div>

										{/* CARD FACULTY - CAREER */}
										<div
											className={`grid col-span-12 gap-4 text-sm p-3 rounded-xl ${accessData?.type_access === 'access_external' ? 'bg-red-200' : 'bg-yellow-100'}`}>
											<div className=' font-medium flex items-center space-x-3 text-gray-700'>
												<BiSolidArch size={35} />
												<div className='flex flex-col'>
													<div className='flex flex-col'>
														<h3 className='font-semibold text-sm break-words line-clamp-1'>
															{accessData?.faculties?.[0]?.faculty?.name}
														</h3>
														<ul className='space-y-2'>
															<li key={accessData?.careers?.[0]?.career?.id_career}>
																<strong>Carrera: </strong>
																{accessData?.careers?.[0]?.career?.name}
															</li>
														</ul>
													</div>
												</div>
											</div>
										</div>
									</div>

									<div className='grid grid-cols-1 sm:grid-cols-1 gap-6 items-center'>
										{/* CARD DIRECTOR */}
										<div className='grid col-span-2 gap-4 text-sm bg-slate-100 border dark:border-gray-700 dark:bg-gray-700/40 rounded-xl p-3'>
											<div className='text-gray-700 dark:text-gray-300 space-y-3 font-medium'>
												<h2 className='text-lg font-semibold text-slate-600 dark:text-neutral-300'>Director</h2>
												<div className='flex gap-3 items-center text-sm'>
													<div className='flex flex-col'>
														{accessData?.directors?.map((director, index) => (
															<div key={index} className='flex items-center gap-3'>
																<Avvvatars size={40} value={director?.name} />
																<div className='flex flex-col gap-2 dark:border-gray-700'>
																	<div className='flex items-center gap-2'>
																		<span className='font-semibold text-sm'>{director?.name}</span>
																	</div>
																	<div className='flex items-center justify-between gap-6 text-xs'>
																		<div className='flex items-center gap-1'>
																			<BiSolidIdCard size={16} />
																			<span>{director?.dni}</span>
																		</div>
																		<div className='flex items-center gap-2'>
																			<BiSolidEnvelope size={16} />
																			<span>{director?.email}</span>
																		</div>
																	</div>
																</div>
															</div>
														))}
													</div>
												</div>
											</div>
										</div>

										{/* CARD APLICANTS */}
										<div className='text-slate-500 dark:text-gray-300 space-y-3 font-medium col-span-2'>
											<div className='flex items-center justify-between'>
												<h2 className='text-lg font-semibold text-slate-600 dark:text-neutral-300'>
													Aplicantes ({accessData?.applicants?.length})
												</h2>
												{userRoles.some(userRole => userRole.type === ROLES.ACCESS_MANAGER) && (
													<Button variant='secondary' size='small' onClick={() => handleAddApplicant()}>
														Añadir aplicante
													</Button>
												)}
											</div>

											<div className='grid sm:grid-cols-2 gap-3 items-start text-sm'>
												{accessData?.applicants?.map((applicant, index) => (
													<div
														key={index}
														className='flex flex-col gap-3 dark:bg-gray-700/40 bg-slate-100 p-4 rounded-lg'>
														{/* Nombre y botones alineados correctamente */}
														<div className='flex items-center justify-between text-xs'>
															<span className='font-medium'>{formatISOToDate(applicant?.createdAt)}</span>

															{userRoles.some(userRole => userRole.type === ROLES.ACCESS_MANAGER) && (
																<div className='flex items-center gap-2'>
																	<Button
																		variant='none'
																		size='small'
																		onClick={() => handleOpenModal(applicant, handleUpdatedApplicant)}>
																		<BiEditAlt />
																	</Button>

																	<Button
																		variant='none'
																		size='small'
																		onClick={() => handleOpenModal(applicant, handleDeletedApplicant)}>
																		<BiSolidTrashAlt className='text-red-400' />
																	</Button>
																</div>
															)}
														</div>

														<div className='flex items-center justify-between'>
															<span className='font-semibold text-sm' title={applicant?.name}>
																{applicant?.name}
															</span>
														</div>

														{/* Datos del aplicante con corrección de textos largos */}
														<div className='flex flex-col text-xs gap-2'>
															<div className='flex items-center gap-1'>
																<BiSolidIdCard size={16} />
																<span title={applicant?.dni}>{applicant?.dni}</span>
															</div>
															<div className='flex items-center gap-1'>
																<BiSolidEnvelope size={16} />
																<span title={applicant?.email}>{applicant?.email}</span>
															</div>
														</div>
													</div>
												))}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>
				)}

				<section class='col-span-4'>
					<div className='space-y-8'>
						<div className='grid grid-cols-1 sm:grid-cols-1 gap-4'>
							{loading ? (
								<>
									<div className='grid col-span-1 gap-3 text-sm p-3 dark:bg-gray-600 h-4 w-28 rounded-lg animate-pulse'></div>
									<div className='grid col-span-1 gap-3 text-sm p-3 dark:bg-gray-600 h-10 w-full rounded-xl animate-pulse'></div>
									<div className='grid col-span-1 gap-3 text-sm p-3 dark:bg-gray-600 h-56 w-full rounded-xl animate-pulse'></div>
									<div className='grid col-span-1 gap-3 text-sm p-3 dark:bg-gray-600 h-56 w-full rounded-xl animate-pulse'></div>
								</>
							) : (
								<>
									<section className='flex text-sm rounded-lg space-x-2 font-semibold'>
										<button
											className={`p-1 transition-all ease-in-out duration-200 ${activeTab === 'membership' ? 'border-b-2 dark:text-gray-200 dark:border-gray-200 text-gray-500 border-slate-500' : 'dark:border-gray-200 hover:dark:text-gray-300 border-slate-200 hover:text-slate-500 border-b-2 dark:border-transparent border-transparent'}`}
											onClick={() => handleTabClick('membership')}>
											Adscripción
										</button>
										<button
											className={`p-1 transition-all ease-in-out duration-200 ${activeTab === 'samples' ? 'border-b-2 dark:text-gray-200 dark:border-gray-200 text-gray-500 border-slate-500' : 'dark:border-gray-200 hover:dark:text-gray-300 border-slate-200 hover:text-slate-500 border-b-2 dark:border-transparent border-transparent'}`}
											onClick={() => handleTabClick('samples')}>
											Muestras
										</button>
										<button
											className={`p-1 transition-all ease-in-out duration-200 ${activeTab === 'reports' ? 'border-b-2 dark:text-gray-200 dark:border-gray-200 text-gray-500 border-slate-500' : 'dark:border-gray-200 hover:dark:text-gray-300 border-slate-200 hover:text-slate-500 border-b-2 dark:border-transparent border-transparent'}`}
											onClick={() => handleTabClick('reports')}>
											Reportes
										</button>
										<button
											className={`p-1 transition-all ease-in-out duration-200 ${activeTab === 'consumptionReactives' ? 'border-b-2 dark:text-gray-200 dark:border-gray-200 text-gray-500 border-slate-500' : 'dark:border-gray-200 hover:dark:text-gray-300 border-slate-200 hover:text-slate-500 border-b-2 dark:border-transparent border-transparent'}`}
											onClick={() => handleTabClick('consumptionReactives')}>
											Consumo reactivos
										</button>
									</section>

									{activeTab === 'membership' && (
										<>{!loading && accessData && <MembershipCard accessData={accessData} />}</>
									)}
									{activeTab === 'samples' && <>{!loading && accessData && <SamplesCard accessData={accessData} />}</>}
									{activeTab === 'consumptionReactives' && (
										<>{!loading && accessData && <ConsumptionReactive accessData={accessData} />}</>
									)}
									{activeTab === 'reports' && <>{!loading && accessData && <ReportCard accessData={accessData} />}</>}
								</>
							)}
						</div>
					</div>
				</section>
			</main>

			{showAddApplicantModal && (
				<ModalAddAplicant onClose={toggleAddApplicantModal} onSuccess={reloadAccess} accessLab={accessData} />
			)}

			{showUpdatedApplicantModal && (
				<ModalUpdateApplicant applicant={selected} onClose={toggleUpdatedApplicantModal} onSuccess={reloadAccess} />
			)}

			{showDeletedApplicantModal && (
				<ModalDeletePermanent applicant={selected} onClose={toggleDeletedApplicantModal} onSuccess={reloadAccess} />
			)}
		</>
	)
}
