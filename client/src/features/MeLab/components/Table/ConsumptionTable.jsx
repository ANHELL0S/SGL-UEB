import { useMemo } from 'react'
import { useTable } from 'react-table'
import { formatISOToDate } from '../../../../helpers/dateTimeZone.helper'
import { Button } from '@/components/Button/Button'
import { BiSolidTrashAlt } from 'react-icons/bi'

export const ConsumptionTable = ({ consumptionPertainToAnalystData, handleOpenDeletedPermanentModal }) => {
	const columns = useMemo(
		() => [
			{
				Header: 'Cnt',
				accessor: 'quantity',
				Cell: ({ row }) => (
					<span className='break-words line-clamp-1'>{parseFloat(row?.original?.amount).toString()}</span>
				),
			},
			{
				Header: 'Unidad',
				accessor: 'unit',
				Cell: ({ row }) => (
					<span className='break-words line-clamp-1'>
						{row?.original?.reactive?.units_measurement?.unit} {row?.original?.reactive?.units_measurement?.name}
					</span>
				),
			},
			{
				Header: 'Reactivo',
				accessor: 'reactive',
				Cell: ({ row }) => {
					const isDeleted = row?.original?.reactive?.deletedAt
					return (
						<div className='space-y-1'>
							<span className={`break-words line-clamp-1 ${isDeleted ? 'line-through text-red-500' : ''}`}>
								{row?.original?.reactive?.name}
							</span>
							<span className={`break-words line-clamp-1 ${isDeleted ? 'line-through text-red-500' : ''}`}>
								<strong>Cod: </strong>
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
						<span>{row?.original?.kardex?.experiments_parameter?.name}</span>
						<span>{row?.original?.kardex?.experiments_parameter?.experiments_category?.name}</span>
					</div>
				),
			},
			{
				Header: 'Personal',
				accessor: 'isIndependent',
				Cell: ({ row }) => (
					<div className='whitespace-normal break-words overflow-hidden line-clamp-2'>
						{row?.original?.kardex?.isIndependent ? 'Si' : 'No'}
					</div>
				),
			},
			{
				Header: 'Nota',
				accessor: 'notes',
				Cell: ({ row }) => (
					<div className='max-w-[2000px] whitespace-normal break-words overflow-hidden line-clamp-2'>
						{row?.original?.kardex?.notes}
					</div>
				),
			},
			{
				Header: 'Creado',
				accessor: 'createdAt',
				Cell: ({ row }) => <span className='break-words line-clamp-2'>{formatISOToDate(row.original.createdAt)}</span>,
			},

			{
				Header: 'Acción',
				accessor: 'action',
				Cell: ({ row }) => (
					<Button variant='none' size='small' onClick={() => handleOpenDeletedPermanentModal(row.original)}>
						<BiSolidTrashAlt className='text-red-400' />
					</Button>
				),
			},
		],
		[handleOpenDeletedPermanentModal]
	)

	const data = useMemo(() => consumptionPertainToAnalystData, [consumptionPertainToAnalystData])

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
