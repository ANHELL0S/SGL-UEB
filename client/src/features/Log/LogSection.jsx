import { LuArchive, LuSearch } from 'react-icons/lu'
import { Status500 } from '../../components/Banner/StatusServer'
import { SpinnerLoading } from '../../components/Loaders/SpinnerLoading'
import { useAllLogsStore } from '../../hooks/useLog'
import { LogTable } from './components/Table/AccessTable'
import { NotFound } from '../../components/Banner/NotFound'
import { BiCaretLeft, BiCaretRight, BiX } from 'react-icons/bi'

export const LogSection = () => {
	const {
		loading,
		error,
		logs,
		logsData,
		fetchLogs,
		page,
		setPage,
		search,
		limit,
		setLimit,
		setSearch,
		totalPages,
		totalRecords,
		handleLimitChange,
		handlePageChange,
		handleSearchChange,
	} = useAllLogsStore()

	if (error) return <Status500 text={error} />

	const renderState = () => {
		if (loading)
			return (
				<div className='flex items-center justify-center py-52'>
					<SpinnerLoading />
				</div>
			)
		if (logsData?.length === 0) {
			const notFoundProps = !search
				? {
						icon: <LuArchive size={50} />,
						title: 'Sin registros',
						description: 'Lo sentimos, no se encontró ningún log.',
					}
				: {
						icon: <LuSearch size={50} />,
						title: 'Sin resultados',
						description: 'Lo sentimos, no se encontraron coincidencias.',
					}
			return (
				<div className='flex justify-center py-32'>
					<NotFound {...notFoundProps} />
				</div>
			)
		}

		return <LogTable logsData={logsData} />
	}

	return (
		<>
			<main className='space-y-4'>
				<section className='text-2xl dark:text-gray-200 text-slate-600 font-semibold relative flex items-center gap-2'>
					<h1>Logs</h1>
				</section>

				<section className='flex items-center justify-between flex-wrap lg:flex-nowrap'>
					<div className='relative group'>
						<input
							type='text'
							placeholder='Buscar...'
							className='p-1.5 pl-8 pr-10 border-2 border-gray-300 rounded-lg bg-white text-gray-700 placeholder-gray-400 font-medium text-sm w-48 focus:outline-none focus:ring-transparent focus:ring-slate-500 focus:border-slate-500 dar:focus:ring-gray-500 dark:focus:border-gray-500 dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-500'
							value={search}
							onChange={handleSearchChange}
						/>
						<LuSearch
							className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400  dark:text-gray-500'
							size={16}
						/>
						{search && (
							<button
								className='absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-300 hover:dark:bg-gray-500 p-1 rounded'
								onClick={() => setSearch('')}
								title='Resetear búsqueda'>
								<BiX size={16} />
							</button>
						)}
					</div>
				</section>

				<section className='space-y-4'>
					<div className='flex items-center gap-4 w-full flex-wrap justify-between text-xs text-slate-500 dark:text-gray-300 font-semibold dark:bg-gray-700/40 bg-slate-100 p-2 rounded-lg'>
						<div className='flex items-center space-x-1'>
							<div className='flex text-slate-500 text-xs pr-2 dark:text-slate-200 sm:w-auto'>
								<button
									onClick={() => handlePageChange(page - 1)}
									disabled={!totalRecords || page === 1}
									className={`transition-all px-2 py-1 rounded duration-300 flex items-center ${
										!totalRecords
											? 'bg-transparent cursor-not-allowed opacity-50'
											: page === 1
												? 'cursor-not-allowed opacity-50'
												: 'dark:hover:bg-gray-700 ease-in-out'
									}`}>
									<BiCaretLeft size={16} />
									<span>Anterior</span>
								</button>

								<button
									onClick={() => handlePageChange(page + 1)}
									disabled={!totalRecords || page === totalPages}
									className={`transition-all px-2 py-1 rounded duration-300 flex items-center ${
										!totalRecords
											? 'bg-transparent cursor-not-allowed opacity-50'
											: page === totalPages
												? 'cursor-not-allowed opacity-50'
												: 'dark:hover:bg-gray-700 ease-in-out'
									}`}>
									<span>Siguiente</span>
									<BiCaretRight size={16} />
								</button>
							</div>

							<div className='border-l pl-4 dark:border-gray-600'>
								<span>
									{totalPages && totalRecords
										? `Mostrando ${page} - ${totalPages || 0} de ${totalRecords} resultados`
										: ''}
								</span>
							</div>
						</div>

						<div className={`space-x-2 ${!totalRecords ? 'opacity-50 cursor-not-allowed' : ''}`}>
							<span>Resultados por página:</span>
							<select
								id='limit'
								value={limit}
								onChange={handleLimitChange}
								disabled={!totalRecords}
								className={`p-1 rounded transition ease-in-out duration-300 w-20 sm:w-auto mt-2 sm:mt-0 ${
									!totalRecords
										? 'bg-transparent cursor-not-allowed'
										: 'cursor-pointer bg-slate-200 dark:bg-slate-700 hover:bg-slate-300/70 dark:hover:bg-slate-600'
								}`}>
								<option value={5}>5</option>
								<option value={10}>10</option>
								<option value={50}>50</option>
								<option value={100}>100</option>
							</select>
						</div>
					</div>

					<div>{renderState()}</div>
				</section>
			</main>
		</>
	)
}
