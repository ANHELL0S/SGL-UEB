import { BiSolidDownArrowAlt, BiSolidShow, BiSolidUpArrowAlt } from 'react-icons/bi'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useSortBy, useTable } from 'react-table'
import { PATH_PRIVATE } from '../../../../helpers/constants.helper'
import { formatISOToDate } from '../../../../helpers/dateTimeZone.helper'

export const ReportTable = ({ reportData, dropdownVisible, toggleDropdown }) => {
	const columns = useMemo(
		() => [
			{
				Header: '#',
				accessor: 'number',
				Cell: ({ row }) => <span className='break-words line-clamp-1'>{row?.original?.number}</span>,
			},
			{
				Header: 'Code',
				accessor: 'code',
				Cell: ({ row }) => (
					<span className='break-words line-clamp-1'>
						{row?.original?.amount} {row?.original?.code}
					</span>
				),
			},
			{
				Header: 'Estado',
				accessor: 'isIssued',
				Cell: ({ row }) => (
					<span
						className={`font-semibold ${
							row?.original?.isIssued ? 'dark:text-teal-400 text-teal-500' : 'dark:text-red-400 text-red-500'
						}`}>
						{row?.original?.isIssued ? 'Emitido' : 'No emitido'}
					</span>
				),
			},
			{
				Header: 'Origen',
				accessor: 'origen',
				Cell: ({ row }) => (
					<span className='break-words line-clamp-1'>
						{row?.original?.sample?.quote?.code
							? row?.original?.sample?.quote?.code
							: row?.original?.sample?.quote?.access?.code}
					</span>
				),
			},
			{
				Header: 'Muestra',
				accessor: 'sample',
				Cell: ({ row }) => <span className='break-words line-clamp-1'>{row?.original?.sample?.name}</span>,
			},
			{
				Header: 'Responsable',
				accessor: 'full_name',
				Cell: ({ row }) => <span className='break-words line-clamp-1'>{row?.original?.senior_analyst?.code}</span>,
			},
			{
				Header: 'Colaborador',
				accessor: 'collaborating_analyst',
				Cell: ({ row }) => (
					<span className='break-words line-clamp-2'>{row?.original?.collaborating_analyst?.code ?? '---'}</span>
				),
			},
			{
				Header: 'Creado',
				accessor: 'createdAt',
				Cell: ({ row }) => (
					<span className='break-words line-clamp-2'>{formatISOToDate(row?.original?.createdAt)}</span>
				),
			},
			{
				Header: 'Acción',
				accessor: 'action',
				Cell: ({ row }) => (
					<Link
						to={{
							pathname: row?.original?.sample?.quote?.code
								? PATH_PRIVATE.ACCESS_QUOTE_DETAIL.replace(':slug', row?.original?.sample?.quote?.code)
								: PATH_PRIVATE.LAB_ACCESS_DETAIL.replace(':slug', row?.original?.sample?.quote?.access?.code),
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

	const data = useMemo(() => reportData, [reportData])

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
