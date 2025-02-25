import { useMemo } from 'react'
import { useSortBy, useTable } from 'react-table'
import { formatISOToDate } from '../../../../helpers/dateTimeZone.helper'
import { BiSolidDownArrowAlt, BiSolidUpArrowAlt } from 'react-icons/bi'

export const KardexTable = ({ kardexData, dropdownVisible }) => {
	const columns = useMemo(
		() => [
			{
				Header: 'Movimiento',
				accessor: 'action_type',
				Cell: ({ row }) => {
					const originalActionType = row?.original?.action_type
					let actionType = originalActionType
					let color = ''

					if (originalActionType === 'adjustment') {
						color = 'text-yellow-500'
						actionType = 'ajuste'
					} else if (originalActionType === 'entry') {
						color = 'text-cyan-500'
						actionType = 'entrada'
					} else if (originalActionType === 'return') {
						color = 'text-red-500'
						actionType = 'salida'
					}

					return <span className={`break-words line-clamp-1 uppercase font-semibold ${color}`}>{actionType}</span>
				},
			},
			{
				Header: 'Cnt',
				accessor: 'quantity',
				Cell: ({ row }) => (
					<span className='break-words line-clamp-1 font-semibold'>
						{parseFloat(row?.original?.quantity).toString()}
					</span>
				),
			},
			{
				Header: 'Balance',
				accessor: 'balance_after_action',
				Cell: ({ row }) => {
					const quantity = parseFloat(row?.original?.balance_after_action).toString()

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
				Header: 'Ud',
				accessor: 'unit',
				Cell: ({ row }) => (
					<div className='space-y-1'>
						<span className='break-words line-clamp-1 font-semibold'>
							{row?.original?.reactive?.units_measurement?.unit}
						</span>
						<span className='break-words line-clamp-1'>{row?.original?.reactive?.units_measurement?.name}</span>
					</div>
				),
			},
			{
				Header: 'Cod reactivo',
				accessor: 'reactive',
				Cell: ({ row }) => {
					const isDeleted = row?.original?.reactive?.deletedAt
					return (
						<div className='space-y-1'>
							<span className={`break-words line-clamp-1 ${isDeleted ? 'line-through text-red-500' : ''}`}>
								{row?.original?.reactive?.code}
							</span>
						</div>
					)
				},
			},
			{
				Header: 'Análisis',
				accessor: 'analysis',
				Cell: ({ row }) => (
					<div className='max-w-[2000px] whitespace-normal break-words overflow-hidden line-clamp-2'>
						{row?.original?.analysis?.name ?? '---'}
					</div>
				),
			},
			{
				Header: 'Nota',
				accessor: 'notes',
				Cell: ({ row }) => (
					<div className='max-w-[2000px] whitespace-normal break-words overflow-hidden line-clamp-2'>
						{row?.original?.notes}
					</div>
				),
			},
			{
				Header: 'Responsable',
				accessor: 'responsible',
				Cell: ({ row }) => <span className='break-words line-clamp-1'>{row?.original?.user?.code}</span>,
			},
			{
				Header: 'Creado',
				accessor: 'createdAt',
				Cell: ({ row }) => <span className='break-words line-clamp-2'>{formatISOToDate(row.original.createdAt)}</span>,
			},
		],
		[dropdownVisible]
	)

	const data = useMemo(() => kardexData, [kardexData])

	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
		{
			columns,
			data,
		},
		useSortBy
	)

	return (
		<div className='overflow-x-auto'>
			<table {...getTableProps()} className='table-auto w-full text-xs font-medium text-left'>
				<thead className='dark:text-gray-400 text-slate-500'>
					{headerGroups.map(headerGroup => (
						<tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map(column => (
								<th {...column.getHeaderProps(column.getSortByToggleProps())} className='p-2 cursor-pointer'>
									<div className='flex'>
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
								className='hover:bg-slate-50 dark:text-gray-300 text-slate-600 
							 dark:hover:bg-slate-700/30 border-t dark:border-t-gray-700/50'>
								{row.cells.map(cell => (
									<td {...cell.getCellProps()} className='px-2 py-1 whitespace-nowrap'>
										{cell.render('Cell')}
									</td>
								))}
							</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	)
}
