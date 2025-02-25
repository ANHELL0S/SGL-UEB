import {
	BiDotsHorizontal,
	BiDotsVertical,
	BiSolidBullseye,
	BiSolidEditAlt,
	BiSolidLockAlt,
	BiSolidTimer,
	BiSolidTrash,
} from 'react-icons/bi'
import { useMemo } from 'react'
import { useTable } from 'react-table'
import { useClickOutside } from '../../hook/useClickOutside'
import { ROLES, ROLES_ES } from '../../../../helpers/constants.helper'
import { formatISOToDate } from '../../../../helpers/dateTimeZone.helper'
export const UserTable = ({
	usersData,
	handleOpenUpdatedModal,
	handleOpenAssignRoleModal,
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
				Header: 'Nombres',
				accessor: 'nombres',
				Cell: ({ row }) => <span className='break-words line-clamp-1'>{row.original.names}</span>,
			},
			{
				Header: 'Código',
				accessor: 'código',
				Cell: ({ row }) => <span className='break-words line-clamp-1'>{row.original.code}</span>,
			},
			{
				Header: 'E-mail',
				accessor: 'e-mail',
				Cell: ({ row }) => <span className='break-words line-clamp-1'>{row.original.email}</span>,
			},
			{
				Header: 'Celular',
				accessor: 'analista',
				Cell: ({ row }) => <span className='break-words line-clamp-1'>{row.original.phone}</span>,
			},
			{
				Header: 'Cédula',
				accessor: 'cédula',
				Cell: ({ row }) => <span className='break-words line-clamp-1'>{row.original.dni}</span>,
			},
			{
				Header: 'Roles',
				accessor: 'roles',
				Cell: ({ row }) => (
					<div className='flex gap-2'>
						{row.original?.roles?.length > 0 ? (
							<>
								{row.original?.roles.slice(0, 2).map((role, roleIndex) => (
									<span
										key={roleIndex}
										className={`px-2 py-0.5 text-xs font-semibold rounded-full text-white ${
											role.type_rol === ROLES.DIRECTOR
												? 'dark:text-amber-300 dark:bg-amber-700/50 bg-amber-200 text-amber-600'
												: role.type_rol === ROLES.SUPERVISOR
													? 'dark:text-emerald-300 dark:bg-emerald-700/50 bg-emerald-200 text-emerald-600'
													: role.type_rol === ROLES.TECHNICAL_ANALYST
														? 'dark:text-purple-300 dark:bg-purple-700/50 bg-purple-200 text-purple-600'
														: role.type_rol === ROLES.ACCESS_MANAGER
															? 'dark:text-blue-300 dark:bg-blue-700/50 bg-blue-200 text-blue-600'
															: 'bg-gray-600'
										}`}>
										{ROLES_ES[role.type_rol] || '---'}
									</span>
								))}
								{row.original.roles.length > 2 && (
									<span className='px-2 py-0.5 text-xs font-medium rounded-full bg-gray-300 text-gray-800'>
										+{row.original.roles.length - 2}
									</span>
								)}
							</>
						) : (
							<span className='text-xs border dark:border-gray-600 rounded-full px-2 py-0.5'>Sin roles</span>
						)}
					</div>
				),
			},
			{
				Header: 'Estado',
				accessor: 'active',
				Cell: ({ row }) => (
					<span
						className={`font-semibold px-2 py-0.5 rounded-full ${
							row?.original?.active
								? 'dark:text-teal-300 dark:bg-teal-700/50 bg-teal-100 text-teal-500'
								: 'dark:text-red-300 dark:bg-red-700/50 bg-red-100 text-red-500'
						}`}>
						{row?.original?.active ? 'Activo' : 'Inactivo'}
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
							onClick={() => toggleDropdown(row.original.id_user)}
							aria-expanded={dropdownVisible === row.original.id_user ? 'true' : 'false'}
							aria-label='Toggle dropdown'>
							<div className={`${dropdownVisible === row.original.id_user ? 'rotate-180' : ''}`}>
								{dropdownVisible === row.original.id_user ? (
									<BiDotsHorizontal className='text-lg transform transition-transform duration-500 ease-in-out' />
								) : (
									<BiDotsVertical className='text-lg transform transition-transform duration-500 ease-in-out' />
								)}
							</div>
						</button>

						{dropdownVisible === row.original.id_user && (
							<div
								ref={dropdownRef}
								className='absolute right-2 mt-2 px-1 border dark:border-gray-600 w-max bg-white dark:bg-gray-800 rounded-xl shadow-lg z-10'>
								<ul className='py-1 text-xs space-y-0 text-slate-500 dark:text-gray-300 font-medium'>
									{!row?.original?.deletedAt && (
										<>
											<li>
												<button
													className='flex items-center gap-2 w-full text-left p-2 hover:bg-slate-200 dark:hover:bg-gray-600/60 rounded-lg transition-all ease-in-out duration-200'
													onClick={() => handleOpenUpdatedModal(row.original)}>
													<BiSolidEditAlt size={14} />
													Editar usuario
												</button>
											</li>

											<li>
												<button
													className='flex items-center gap-2 w-full text-left p-2 hover:bg-slate-200 dark:hover:bg-gray-600/60 rounded-lg transition-all ease-in-out duration-200'
													onClick={() => handleOpenAssignRoleModal(row.original)}>
													<BiSolidLockAlt size={14} />
													Administrar Roles
												</button>
											</li>
										</>
									)}

									<li>
										{row?.original?.deletedAt ? (
											<button
												className='flex items-center gap-2 w-full text-left p-2 hover:bg-slate-200 dark:hover:bg-gray-600/60 rounded-lg transition-all ease-in-out duration-200'
												onClick={() => handleOpenRestoredModal(row.original)}>
												<BiSolidTimer size={14} />
												Restaurar usuario
											</button>
										) : row?.original?.active ? (
											<button
												className='flex items-center gap-2 w-full text-left p-2 hover:bg-slate-200 dark:hover:bg-gray-600/60 rounded-lg transition-all ease-in-out duration-200'
												onClick={() => handleOpenDesactivedModal(row.original)}>
												<BiSolidBullseye size={14} />
												Deshabilitar usuario
											</button>
										) : (
											<button
												className='flex items-center gap-2 w-full text-left p-2 hover:bg-slate-200 dark:hover:bg-gray-600/60 rounded-lg transition-all ease-in-out duration-200'
												onClick={() => handleOpenActivedModal(row.original)}>
												<BiSolidBullseye size={14} />
												Habilitar usuario
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
												Eliminar usuario
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
			handleOpenAssignRoleModal,
			handleOpenDesactivedModal,
			handleOpenActivedModal,
			handleOpenRestoredModal,
			handleOpenDeletedModal,
			handleOpenDeletedPermanentModal,
		]
	)

	const data = useMemo(() => usersData, [usersData])

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
