import { useMemo } from 'react'
import { useTable } from 'react-table'
import { useClickOutside } from '../../hook/useClickOutside'
import { formatISOToDate } from '../../../../helpers/dateTimeZone.helper'
import {
	BiDotsHorizontal,
	BiDotsVertical,
	BiSolidCheckCircle,
	BiSolidCircle,
	BiSolidCoupon,
	BiSolidEditAlt,
	BiSolidShow,
	BiSolidTimer,
	BiSolidTrash,
	BiSolidXCircle,
} from 'react-icons/bi'
import { PATH_PRIVATE } from '../../../../helpers/constants.helper'
import { Link } from 'react-router-dom'

export const QuoteTable = ({
	quotesData,
	handleOpenUpdatedModal,
	handleOpenBillModal,
	handleOpenApprovedModal,
	handleOpenPendingModal,
	handleOpenRejectedModal,
	handleOpenDeletedModal,
	handleOpenRestoredModal,
	handleOpenDeletedPermanentModal,
	userRoles,
	ROLES,
	dropdownVisible,
	toggleDropdown,
}) => {
	const dropdownRef = useClickOutside(() => toggleDropdown(null))

	const columns = useMemo(
		() => [
			{
				Header: 'Código',
				accessor: 'code',
				Cell: ({ row }) => <span className='flex flex-col gap-2'>{row.original.code} </span>,
			},
			{
				Header: 'Nombre',
				accessor: 'name',
				Cell: ({ row }) => (
					<div className='flex flex-col space-y-1'>
						<span className='break-words line-clamp-1'>{row.original.name}</span>
					</div>
				),
			},
			{
				Header: 'Cédula',
				accessor: 'dni',
				Cell: ({ row }) => (
					<div className='flex flex-col space-y-1'>
						<span className='break-words line-clamp-1'>{row.original.dni}</span>
					</div>
				),
			},
			{
				Header: 'Análisis',
				accessor: 'experiments',
				Cell: ({ row }) => <span className='flex flex-col gap-2'>{row.original.experiments.length}</span>,
			},
			{
				Header: 'Deposito',
				accessor: 'bill',
				Cell: ({ row }) => (
					<span className='flex flex-col gap-2'>
						{row.original.type_quote === 'external' ? <span>{row.original.bill || '---'}</span> : <h1>No aplica</h1>}
					</span>
				),
			},
			{
				Header: 'Estado',
				accessor: 'status',
				Cell: ({ row }) => (
					<span
						className={`font-semibold px-2 py-0.5 rounded-full ${
							{
								Aprobado: 'dark:text-emerald-300 dark:bg-emerald-700/50 bg-emerald-100 text-emerald-500',
								Pendiente: 'dark:text-yellow-300 dark:bg-yellow-700/50 bg-yellow-100 text-yellow-500',
								Rechazado: 'dark:text-red-300 dark:bg-red-700/50 bg-red-100 text-red-500',
							}[row.original.status]
						}`}>
						{row.original.status}
					</span>
				),
			},
			{
				Header: 'Creado',
				accessor: 'createdAt',
				Cell: ({ row }) => <span className='break-words line-clamp-2'>{formatISOToDate(row.original.createdAt)}</span>,
			},
			{
				Header: 'Actualizado',
				accessor: 'updatedAt',
				Cell: ({ row }) => (
					<span className='break-words line-clamp-2'>
						{row.original.updatedAt !== row.original.createdAt ? (
							<span className='break-words line-clamp-2'>{formatISOToDate(row.original.updatedAt)}</span>
						) : (
							'---'
						)}
					</span>
				),
			},
			{
				Header: 'Eliminado',
				accessor: 'deletedAt',
				Cell: ({ row }) => (
					<span className='break-words line-clamp-2'>
						{row.original.deletedAt ? formatISOToDate(row.original.deletedAt) : '---'}
					</span>
				),
			},
			{
				Header: 'Acciones',
				accessor: 'acciones',
				Cell: ({ row }) => (
					<td className='px-2 text-xs py-1.5 relative'>
						<div className='flex items-center'>
							<button
								className='p-1.5 text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-gray-600/50 dark:hover:text-gray-100 rounded-full transition-all ease-in-out duration-300'
								onClick={() => toggleDropdown(row.original.id_quote)}
								aria-expanded={dropdownVisible === row.original.id_quote ? 'true' : 'false'}
								aria-label='Toggle dropdown'>
								<div className={`${dropdownVisible === row.original.id_quote ? 'rotate-180' : ''}`}>
									{dropdownVisible === row.original.id_quote ? (
										<BiDotsHorizontal className='text-lg transform transition-transform duration-500 ease-in-out' />
									) : (
										<BiDotsVertical className='text-lg transform transition-transform duration-500 ease-in-out' />
									)}
								</div>
							</button>
						</div>

						{dropdownVisible === row.original.id_quote && (
							<div
								ref={dropdownRef}
								className='absolute right-2 mt-2 px-1 border dark:border-gray-600 w-max bg-white dark:bg-gray-800 rounded-xl shadow-lg z-10'>
								<ul className='py-1 text-xs space-y-0 text-slate-500 dark:text-gray-300 font-medium'>
									{!row?.original?.deletedAt ? (
										<>
											<li>
												<Link
													to={{
														pathname: PATH_PRIVATE.ACCESS_QUOTE_DETAIL.replace(':slug', row.original.code),
													}}
													state={row.original}
													className='dark:text-slate-300 flex items-center gap-2 w-full text-left p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-all ease-in-out duration-200'>
													<BiSolidShow size={14} />
													Ver detalles
												</Link>
											</li>

											{userRoles.some(userRole => userRole.type === ROLES.ACCESS_MANAGER) && (
												<>
													<li>
														<button
															className='flex items-center gap-2 w-full text-left p-2 hover:bg-slate-200 dark:hover:bg-gray-600/60 rounded-lg transition-all ease-in-out duration-200'
															onClick={() => handleOpenUpdatedModal(row.original)}>
															<BiSolidEditAlt size={14} />
															Editar cotización
														</button>
													</li>
													<li>
														<button
															className='flex items-center gap-2 w-full text-left p-2 hover:bg-slate-200 dark:hover:bg-gray-600/60 rounded-lg transition-all ease-in-out duration-200'
															onClick={() => handleOpenBillModal(row.original)}>
															<BiSolidCoupon size={14} />
															Añadir deposito
														</button>
													</li>
												</>
											)}

											{userRoles.some(userRole => userRole.type === ROLES.DIRECTOR) && (
												<>
													<li>
														<button
															className='dark:text-emerald-300 flex items-center gap-2 w-full text-left p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-all ease-in-out duration-200'
															onClick={() => handleOpenApprovedModal(row.original)}>
															<BiSolidCheckCircle size={14} />
															Aprobar cotización
														</button>
													</li>

													<li>
														<button
															className='dark:text-amber-300 flex items-center gap-2 w-full text-left p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-all ease-in-out duration-200'
															onClick={() => handleOpenPendingModal(row.original)}>
															<BiSolidCircle size={14} />
															Pendiente cotización
														</button>
													</li>

													<li>
														<button
															className='dark:text-red-400 flex items-center gap-2 w-full text-left p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-all ease-in-out duration-200'
															onClick={() => handleOpenRejectedModal(row.original)}>
															<BiSolidXCircle size={14} />
															Rechazar cotización
														</button>
													</li>
												</>
											)}
										</>
									) : (
										<li>
											{userRoles.some(userRole => userRole.type === ROLES.ACCESS_MANAGER) && (
												<button
													className='flex items-center gap-2 w-full text-left p-2 hover:bg-slate-200 dark:hover:bg-gray-600/60 rounded-lg transition-all ease-in-out duration-200'
													onClick={() => handleOpenRestoredModal(row.original)}>
													<BiSolidTimer size={14} />
													Restaurar cotización
												</button>
											)}
										</li>
									)}

									<li>
										{userRoles.some(userRole => userRole.type === ROLES.ACCESS_MANAGER) && (
											<>
												{row?.original?.deletedAt ? (
													<button
														className='w-full text-left p-2 hover:bg-red-200 dark:hover:bg-red-400 flex items-center gap-2 rounded-lg dark:text-red-400 text-red-500 dark:hover:text-slate-900 transition-all ease-in-out duration-200'
														onClick={() => handleOpenDeletedPermanentModal(row.original)}>
														<BiSolidTrash size={14} />
														Eliminado permanente
													</button>
												) : (
													<button
														className='w-full text-left p-2 hover:bg-red-200 dark:hover:bg-red-400 flex items-center gap-2 rounded-lg dark:text-red-400 text-red-500 dark:hover:text-slate-900 transition-all ease-in-out duration-200'
														onClick={() => handleOpenDeletedModal(row.original)}>
														<BiSolidTrash size={14} />
														Eliminar cotización
													</button>
												)}
											</>
										)}
									</li>
								</ul>
							</div>
						)}
					</td>
				),
			},
		],
		[
			dropdownVisible,
			handleOpenUpdatedModal,
			handleOpenBillModal,
			handleOpenApprovedModal,
			handleOpenPendingModal,
			handleOpenRejectedModal,
			handleOpenDeletedModal,
			handleOpenRestoredModal,
			handleOpenDeletedPermanentModal,
			userRoles,
			ROLES,
		]
	)

	const data = useMemo(() => quotesData, [quotesData])

	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
		columns,
		data,
	})

	return (
		<table {...getTableProps()} className='min-w-full text-xs font-medium text-left'>
			<thead className='dark:text-gray-400 text-slate-500'>
				{headerGroups.map(headerGroup => (
					<tr {...headerGroup.getHeaderGroupProps()}>
						{headerGroup.headers.map(column => (
							<th {...column.getHeaderProps()} className='p-2'>
								<div className='flex items-center gap-1'>{column.render('Header')}</div>
							</th>
						))}
					</tr>
				))}
			</thead>

			<tbody {...getTableBodyProps()}>
				{rows.map(row => {
					prepareRow(row)
					return (
						<>
							<tr
								{...row.getRowProps()}
								className='hover:bg-slate-50 dark:text-gray-300 text-slate-600 dark:hover:bg-slate-700/30 border-t dark:border-t-gray-700/50'>
								{row.cells.map(cell => (
									<td {...cell.getCellProps()} className='px-2 py-1'>
										{cell.render('Cell')}
									</td>
								))}
							</tr>
						</>
					)
				})}
			</tbody>
		</table>
	)
}
