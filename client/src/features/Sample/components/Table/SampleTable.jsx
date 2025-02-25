import {
	BiDotsHorizontal,
	BiDotsVertical,
	BiSolidBullseye,
	BiSolidDownArrowAlt,
	BiSolidEditAlt,
	BiSolidShow,
	BiSolidTrash,
	BiSolidUpArrowAlt,
} from 'react-icons/bi'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useSortBy, useTable } from 'react-table'
import { useClickOutside } from '../../hook/useClickOutside'
import { PATH_PRIVATE } from '../../../../helpers/constants.helper'
import { formatISOToDate } from '../../../../helpers/dateTimeZone.helper'

export const SampleTable = ({
	samplesData,
	handleOpenUpdatedModal,
	handleOpenStatusModal,
	handleOpenDeletedModal,
	dropdownVisible,
	toggleDropdown,
}) => {
	console.log(samplesData)
	const dropdownRef = useClickOutside(() => toggleDropdown(null))

	const columns = useMemo(
		() => [
			{
				Header: 'Nombre',
				accessor: 'name',
				Cell: ({ row }) => <span className='break-words line-clamp-1'>{row?.original?.name}</span>,
			},
			{
				Header: 'Cnt',
				accessor: 'amount',
				Cell: ({ row }) => (
					<span className='break-words line-clamp-1'>
						{row?.original?.amount} {row?.original?.unit_measurement?.unit}
					</span>
				),
			},
			{
				Header: 'Contenedor',
				accessor: 'container',
				Cell: ({ row }) => <span className='break-words line-clamp-1'>{row?.original?.container}</span>,
			},
			{
				Header: 'Estado',
				accessor: 'status',
				Cell: ({ row }) => <span className='break-words line-clamp-1'>{row?.original?.status}</span>,
			},
			{
				Header: 'Cod',
				accessor: 'resolution_approval',
				Cell: ({ row }) => (
					<span className='break-words line-clamp-1'>
						{row?.original?.quote?.code ?? row?.original?.quote?.access?.code}
					</span>
				),
			},
			{
				Header: 'Responsable',
				accessor: 'full_name',
				Cell: ({ row }) => <span className='break-words line-clamp-1'>{row?.original?.user?.code}</span>,
			},
			{
				Header: 'Análista',
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
				Header: '',
				accessor: 'action',
				Cell: ({ row }) => (
					<Link
						to={{
							pathname: row?.original?.quote?.code
								? PATH_PRIVATE.ACCESS_QUOTE_DETAIL.replace(':slug', row?.original?.quote?.code)
								: PATH_PRIVATE.LAB_ACCESS_DETAIL.replace(':slug', row?.original?.quote?.access?.code),
						}}
						state={row.original}
						className='dark:text-slate-300 flex items-center gap-2 w-full text-left p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-all ease-in-out duration-200'>
						<BiSolidShow size={14} />
						Detalles
					</Link>
				),
			},
		],
		[dropdownVisible]
	)

	const data = useMemo(() => samplesData, [samplesData])

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
							<th {...column.getHeaderProps(column.getSortByToggleProps())} className='p-2 cursor-pointer'>
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
								<td {...cell.getCellProps()} className='px-2 py-0.5'>
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
