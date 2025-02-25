import { useMemo } from 'react'
import { useTable } from 'react-table'
import { Link } from 'react-router-dom'
import { BiSolidShow } from 'react-icons/bi'
import { PATH_PRIVATE } from '../../../../helpers/constants.helper'
import { formatISOToDate } from '../../../../helpers/dateTimeZone.helper'

export const AccessTable = ({ accessPertainToAnalystData }) => {
	const columns = useMemo(
		() => [
			{
				Header: 'Código',
				accessor: 'code',
				Cell: ({ row }) => (
					<div className='flex flex-col gap-1'>
						<span>{row?.original?.code}</span>
					</div>
				),
			},
			{
				Header: 'Estado',
				accessor: 'status',
				Cell: ({ row }) => (
					<div className='flex flex-col gap-1'>
						<span>
							<span
								className={`font-semibold ${
									{
										Aprovado: 'dark:text-emerald-300 text-emerald-500',
										Pendiente: 'dark:text-yellow-300 text-yellow-500',
										Rechazado: 'dark:text-red-300 text-red-500',
									}[row?.original?.status]
								}`}>
								{[row?.original?.status]}
							</span>
						</span>
					</div>
				),
			},
			{
				Header: 'Resolución aprovación',
				accessor: 'reason',
				Cell: ({ row }) => (
					<div className='space-y-1'>
						<span className='break-words line-clamp-1'>{row?.original?.resolution_approval}</span>
					</div>
				),
			},
			{
				Header: 'Permanencia',
				accessor: 'datePermanenceEnd',
				Cell: ({ row }) => (
					<div>
						<span className='break-words line-clamp-1'>{row?.original?.datePermanenceStart}</span>
						<span className='break-words line-clamp-1'>{row?.original?.datePermanenceEnd}</span>
					</div>
				),
			},
			{
				Header: 'Creado',
				accessor: 'createdAt',
				Cell: ({ row }) => <span className='break-words line-clamp-2'>{formatISOToDate(row.original.createdAt)}</span>,
			},
			{
				Header: '',
				accessor: 'action',
				Cell: ({ row }) => (
					<Link
						to={{
							pathname: PATH_PRIVATE.LAB_ACCESS_DETAIL.replace(':slug', row.original?.code),
						}}
						state={row.original}
						className='dark:text-slate-300 flex items-center gap-2 w-full text-left p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-all ease-in-out duration-200'>
						<BiSolidShow size={14} />
						Detalles
					</Link>
				),
			},
		],
		[]
	)

	const data = useMemo(() => accessPertainToAnalystData, [accessPertainToAnalystData])

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
						<tr
							{...row.getRowProps()}
							className='hover:bg-slate-50 dark:text-gray-300 text-slate-600 dark:hover:bg-slate-700/30 border-t dark:border-t-gray-700/50'>
							{row.cells.map(cell => (
								<td {...cell.getCellProps()} className='px-2 py-3'>
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
