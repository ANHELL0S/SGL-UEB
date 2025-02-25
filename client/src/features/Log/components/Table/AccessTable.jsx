import { useMemo } from 'react'
import { useTable, useSortBy } from 'react-table'
import { formatISOToDate } from '../../../../helpers/dateTimeZone.helper'

export const LogTable = ({ logsData }) => {
	const columns = useMemo(
		() => [
			{
				Header: 'Nivel',
				accessor: 'level',
				Cell: ({ row }) => {
					const level = row?.original?.level
					const levelColors = {
						info: 'text-cyan-400',
						error: 'text-red-400',
						success: 'text-emerald-400',
						warning: 'text-yellow-400',
					}

					return (
						<span className={`break-words line-clamp-1 uppercase font-medium ${levelColors[level] || 'text-gray-500'}`}>
							{level}
						</span>
					)
				},
			},
			{
				Header: 'IP',
				accessor: 'ipAddress',
				Cell: ({ row }) => <span className='break-words line-clamp-1'>{row?.original?.ipAddress}</span>,
			},
			{
				Header: 'Usuario',
				accessor: 'user',
				Cell: ({ row }) => <span className='break-words line-clamp-1'>{row?.original?.user?.full_name || '---'}</span>,
			},
			{
				Header: 'Método',
				accessor: 'httpMethod',
				Cell: ({ row }) => <span className='break-words line-clamp-1'>{row?.original?.httpMethod}</span>,
			},
			{
				Header: 'Endpoint',
				accessor: 'endpoint',
				Cell: ({ row }) => <span className='break-words line-clamp-1'>{row?.original?.endpoint}</span>,
			},
			{
				Header: 'Mensaje',
				accessor: 'message',
				Cell: ({ row }) => <span className='break-words line-clamp-1'>{row?.original?.message}</span>,
			},
			{
				Header: 'Meta Data',
				accessor: 'meta',
				Cell: ({ row }) => {
					let metaData = row?.original?.meta

					try {
						metaData = typeof metaData === 'string' ? JSON.parse(metaData) : metaData
					} catch (error) {
						console.error('Error al parsear JSON:', error)
						metaData = { error: 'Invalid JSON' }
					}

					return (
						<pre className='bg-gray-900/80 text-white text-xs p-2 rounded-md overflow-auto max-w-sm'>
							{JSON.stringify(metaData, null, 2)}
						</pre>
					)
				},
			},
			{
				Header: 'Creado',
				accessor: 'createdAt',
				Cell: ({ row }) => <span className='break-words line-clamp-2'>{formatISOToDate(row.original.createdAt)}</span>,
			},
		],
		[logsData]
	)

	const data = useMemo(() => logsData, [logsData])

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
		state: { sortBy },
		setSortBy,
	} = useTable(
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
									<td {...cell.getCellProps()} className='p-4'>
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
