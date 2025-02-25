import {
	BiDotsHorizontal,
	BiDotsVertical,
	BiSolidBullseye,
	BiSolidDownArrowAlt,
	BiSolidEditAlt,
	BiSolidTimer,
	BiSolidTrash,
	BiSolidUpArrowAlt,
} from 'react-icons/bi'
import { useMemo } from 'react'
import { useSortBy, useTable } from 'react-table'
import { useClickOutside } from '../../hook/useClickOutside'
import { formatISOToDate } from '../../../../helpers/dateTimeZone.helper'

export const ReactiveTable = ({
	reactivesData,
	handleOpenUpdatedModal,
	handleOpenActivedModal,
	handleOpenDesactivedModal,
	handleOpenDeletedModal,
	handleOpenRestoredModal,
	handleOpenDeletedPermanentModal,
	dropdownVisible,
	toggleDropdown,
}) => {
	const dropdownRef = useClickOutside(() => toggleDropdown(null))

	const columns = useMemo(
		() => [
			{
				Header: 'Nombre',
				accessor: 'name',
				Cell: ({ row }) => (
					<div className='flex flex-col gap-1'>
						<span className='break-words line-clamp-1'>{row.original.name}</span>
						<span>
							<strong>Cod: </strong>
							{row.original.code}
						</span>
					</div>
				),
			},
			{
				Header: 'Conte',
				accessor: 'number_of_containers',
				Cell: ({ row }) => <span className='break-words line-clamp-1'>{row.original.number_of_containers}</span>,
			},
			{
				Header: 'Cnt Actual',
				accessor: 'current_quantity',
				Cell: ({ row }) => {
					const quantity = parseFloat(row?.original?.current_quantity).toString()

					let badgeColor = ''
					if (quantity < 5) {
						badgeColor = 'dark:bg-red-700/70 bg-red-200/80 text-red-600/80'
					} else if (quantity < 15) {
						badgeColor = 'dark:bg-amber-700/70 bg-amber-200/80 text-amber-600/80'
					} else if (quantity < 35) {
						badgeColor = 'dark:bg-yellow-700 bg-yellow-200/80 text-yellow-600/80'
					} else if (quantity < 70) {
						badgeColor = 'dark:bg-cyan-700/ bg-cyan-200/80 text-cyan-600/80'
					} else if (quantity < 100) {
						badgeColor = 'dark:bg-blue-700/80 bg-blue-200/80 text-blue-600/80'
					} else if (quantity <= 500) {
						badgeColor = 'dark:bg-purple-700/80 bg-purple-200/80 text-purple-600/80'
					} else {
						badgeColor = 'dark:bg-emerald-700/80 bg-emerald-200/80 text-emerald-600/80'
					}

					return (
						<span className={`px-2 py-0.5 rounded-full font-semibold dark:text-gray-50 ${badgeColor}`}>{quantity}</span>
					)
				},
			},
			{
				Header: 'Ud medida',
				accessor: 'unit',
				Cell: ({ row }) => (
					<div className='space-y-1'>
						<span className='break-words line-clamp-1 font-semibold'>{row?.original?.unit?.unit}</span>
						<span className='break-words line-clamp-1 dark:text-gray-300/80'>{row?.original?.unit?.name}</span>
					</div>
				),
			},
			{
				Header: 'CAS',
				accessor: 'cas',
				Cell: ({ row }) => <span className='break-words line-clamp-1'>{row?.original?.cas || '---'}</span>,
			},
			{
				Header: 'Fiscalización',
				accessor: 'control_tracking',
				Cell: ({ row }) => <span className='break-words line-clamp-1'>{row?.original?.control_tracking || '---'}</span>,
			},
			{
				Header: 'Expira',
				accessor: 'expiration_date',
				Cell: ({ row }) => <span className='break-words line-clamp-1'>{row.original.expiration_date || '---'}</span>,
			},
			{
				Header: 'Estado',
				accessor: 'status',
				Cell: ({ value }) => (
					<span
						className={`font-semibold px-2 py-0.5 rounded-full ${
							value
								? 'dark:text-teal-300 dark:bg-teal-700/50 bg-teal-100 text-teal-500'
								: 'dark:text-red-300 dark:bg-red-700/50 bg-red-100 text-red-500'
						}`}>
						{value ? 'Activo' : 'Inactivo'}
					</span>
				),
				sortType: (rowA, rowB) => {
					const a = rowA.values.status ? 1 : 0
					const b = rowB.values.status ? 1 : 0
					return a - b
				},
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
						<button
							className='p-1.5 text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-gray-600/50 dark:hover:text-gray-100 rounded-full transition-all ease-in-out duration-300'
							onClick={() => toggleDropdown(row.original.id_reactive)}
							aria-expanded={dropdownVisible === row.original.id_reactive ? 'true' : 'false'}
							aria-label='Toggle dropdown'>
							<div className={`${dropdownVisible === row.original.id_reactive ? 'rotate-180' : ''}`}>
								{dropdownVisible === row.original.id_reactive ? (
									<BiDotsHorizontal className='text-lg transform transition-transform duration-500 ease-in-out' />
								) : (
									<BiDotsVertical className='text-lg transform transition-transform duration-500 ease-in-out' />
								)}
							</div>
						</button>

						{dropdownVisible === row.original.id_reactive && (
							<div
								ref={dropdownRef}
								className='absolute right-2 mt-2 px-1 border dark:border-gray-600 w-max bg-white dark:bg-gray-800 rounded-xl shadow-lg z-10'>
								<ul className='py-1 text-xs space-y-0 text-slate-500 dark:text-gray-300 font-medium'>
									<li>
										{row.original.deletedAt ? (
											<button
												className='flex items-center gap-2 w-full text-left p-2 hover:bg-slate-200 dark:hover:bg-gray-600/60 rounded-lg transition-all ease-in-out duration-200'
												onClick={() => handleOpenRestoredModal(row.original)}>
												<BiSolidTimer size={14} />
												Restaurar reactivo
											</button>
										) : (
											<button
												className='flex items-center gap-2 w-full text-left p-2 hover:bg-slate-200 dark:hover:bg-gray-600/60 rounded-lg transition-all ease-in-out duration-200'
												onClick={() => handleOpenUpdatedModal(row.original)}>
												<BiSolidEditAlt size={14} />
												Editar reactivo
											</button>
										)}
									</li>

									{!row?.original?.deletedAt && (
										<li>
											{row?.original?.status ? (
												<button
													className='flex items-center gap-2 w-full text-left p-2 hover:bg-slate-200 dark:hover:bg-gray-600/60 rounded-lg transition-all ease-in-out duration-200'
													onClick={() => handleOpenDesactivedModal(row.original)}>
													<BiSolidBullseye size={14} />
													Deshabilitar reactivo
												</button>
											) : (
												<button
													className='flex items-center gap-2 w-full text-left p-2 hover:bg-slate-200 dark:hover:bg-gray-600/60 rounded-lg transition-all ease-in-out duration-200'
													onClick={() => handleOpenActivedModal(row.original)}>
													<BiSolidBullseye size={14} />
													Habilitar reactivo
												</button>
											)}
										</li>
									)}

									<li>
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
												Eliminar reactivo
											</button>
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
			handleOpenDesactivedModal,
			handleOpenRestoredModal,
			handleOpenDeletedPermanentModal,
			handleOpenActivedModal,
			handleOpenDeletedModal,
		]
	)

	const data = useMemo(() => reactivesData, [reactivesData])

	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
		{
			columns,
			data,
		},
		useSortBy
	)

	return (
		<table {...getTableProps()} className='min-w-full text-xs font-medium text-left'>
			<thead className='dark:text-gray-400 text-slate-500'>
				{headerGroups.map(headerGroup => (
					<tr {...headerGroup.getHeaderGroupProps()}>
						{headerGroup.headers.map(column => (
							<th {...column.getHeaderProps(column.getSortByToggleProps())} className='px-1 py-2 cursor-pointer'>
								<div className='flex items-center gap-1'>
									{column.render('Header')}
									{column.isSorted ? (
										column.isSortedDesc ? (
											<BiSolidDownArrowAlt size={17} />
										) : (
											<BiSolidUpArrowAlt size={17} />
										)
									) : (
										''
									)}
								</div>
							</th>
						))}
					</tr>
				))}
			</thead>

			<tbody {...getTableBodyProps()}>
				{rows.map(row => {
					prepareRow(row)
					return (
						<tr
							{...row.getRowProps()}
							className='hover:bg-slate-50 dark:text-gray-300 text-slate-600 dark:hover:bg-slate-700/30 border-t dark:border-t-gray-700/50'>
							{row.cells.map(cell => (
								<td {...cell.getCellProps()} className='px-1 py-1'>
									{cell.render('Cell')}
								</td>
							))}
						</tr>
					)
				})}
			</tbody>
		</table>
	)
}
