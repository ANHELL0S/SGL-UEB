import { useMemo } from 'react'
import { useTable } from 'react-table'
import { useClickOutside } from '../../hook/useClickOutside'
import { formatISOToDate } from '../../../../helpers/dateTimeZone.helper'
import {
	BiDotsHorizontal,
	BiDotsVertical,
	BiSolidBullseye,
	BiSolidEditAlt,
	BiSolidTimer,
	BiSolidTrash,
} from 'react-icons/bi'

export const ExperimentTable = ({
	experimentsData,
	handleOpenUpdatedModal,
	handleOpenActivedModal,
	handleOpenDesactivedModal,
	handleOpenDeletedModal,
	handleOpenDeletedPermanentModal,
	handleOpenRestoredModal,
	dropdownVisible,
	toggleDropdown,
}) => {
	const dropdownRef = useClickOutside(() => toggleDropdown(null))

	const columns = useMemo(
		() => [
			{
				Header: 'Nombre',
				accessor: 'name',
				Cell: ({ row }) => <span className='break-words line-clamp-1 text-xs'>{row?.original?.name}</span>,
			},
			{
				Header: 'Categoria',
				accessor: 'category',
				Cell: ({ row }) => (
					<div className='break-words line-clamp-1 text-xs'>
						<span className={row?.original?.category?.deletedAt ? 'line-through dark:text-red-400' : ''}>
							{row?.original?.category?.name || '---'}
						</span>
					</div>
				),
			},
			{
				Header: 'Precio',
				accessor: 'public_price',
				Cell: ({ row }) => <span className='font-semibold'>USD {row?.original?.public_price}</span>,
			},
			{
				Header: 'Estado',
				accessor: 'status',
				Cell: ({ row }) => (
					<span
						className={`font-semibold px-2 py-0.5 rounded-full ${
							row?.original?.status
								? 'dark:text-teal-300 dark:bg-teal-700/50 bg-teal-100 text-teal-500'
								: 'dark:text-red-300 dark:bg-red-700/50 bg-red-100 text-red-500'
						}`}>
						{row?.original?.status ? 'Activo' : 'Inactivo'}
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
						<button
							className='p-1.5 text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-gray-600/50 dark:hover:text-gray-100 rounded-full transition-all ease-in-out duration-300'
							onClick={() => toggleDropdown(row.original.id_experiment_parameter)}
							aria-expanded={dropdownVisible === row.original.id_experiment_parameter ? 'true' : 'false'}
							aria-label='Toggle dropdown'>
							<div className={`${dropdownVisible === row.original.id_experiment_parameter ? 'rotate-180' : ''}`}>
								{dropdownVisible === row.original.id_experiment_parameter ? (
									<BiDotsHorizontal className='text-lg transform transition-transform duration-500 ease-in-out' />
								) : (
									<BiDotsVertical className='text-lg transform transition-transform duration-500 ease-in-out' />
								)}
							</div>
						</button>

						{dropdownVisible === row.original.id_experiment_parameter && (
							<div
								ref={dropdownRef}
								className='absolute right-2 mt-2 px-1 border dark:border-gray-600 w-max bg-white dark:bg-gray-800 rounded-xl shadow-lg z-10'>
								<ul className='py-1 text-xs space-y-0 text-slate-500 dark:text-gray-300 font-medium'>
									{!row?.original?.deletedAt && (
										<li>
											<button
												className='flex items-center gap-2 w-full text-left p-2 hover:bg-slate-200 dark:hover:bg-gray-600/60 rounded-lg transition-all ease-in-out duration-200'
												onClick={() => handleOpenUpdatedModal(row.original)}>
												<BiSolidEditAlt size={14} />
												Editar parametro
											</button>
										</li>
									)}

									<li>
										{row?.original?.deletedAt ? (
											<button
												className='flex items-center gap-2 w-full text-left p-2 hover:bg-slate-200 dark:hover:bg-gray-600/60 rounded-lg transition-all ease-in-out duration-200'
												onClick={() => handleOpenRestoredModal(row.original)}>
												<BiSolidTimer size={14} />
												Restaurar parametro
											</button>
										) : row?.original?.status ? (
											<button
												className='flex items-center gap-2 w-full text-left p-2 hover:bg-slate-200 dark:hover:bg-gray-600/60 rounded-lg transition-all ease-in-out duration-200'
												onClick={() => handleOpenDesactivedModal(row.original)}>
												<BiSolidBullseye size={14} />
												Deshabilitar parametro
											</button>
										) : (
											<button
												className='flex items-center gap-2 w-full text-left p-2 hover:bg-slate-200 dark:hover:bg-gray-600/60 rounded-lg transition-all ease-in-out duration-200'
												onClick={() => handleOpenActivedModal(row.original)}>
												<BiSolidBullseye size={14} />
												Habilitar parametro
											</button>
										)}
									</li>

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
												Eliminar parametro
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
			handleOpenActivedModal,
			handleOpenDeletedPermanentModal,
			handleOpenRestoredModal,
			handleOpenDeletedModal,
		]
	)

	const data = useMemo(() => experimentsData, [experimentsData])

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
								<td {...cell.getCellProps()} className='px-2 py-2'>
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
