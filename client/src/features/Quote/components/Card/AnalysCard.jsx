export const AnalysCard = ({ quoteData }) => {
	return (
		<>
			<section className='col-span-1'>
				<div className='flex justify-between dark:text-gray-300 font-medium text-slate-600 text-sm'>
					<span>Total ({quoteData.experiments.length})</span>
				</div>
			</section>

			<section className='max-h-96 overflow-y-auto dark:bg-gray-700/30 bg-slate-100 border dark:border-gray-700 rounded-lg p-2'>
				<table className='w-full border-collapse'>
					<thead className='text-gray-500 dark:text-gray-300'>
						<tr className='dark:text-gray-400 font-medium text-xs'>
							<th className='text-left p-2'>Nombre</th>
							<th className='text-left p-2'>Categoría</th>
							<th className='text-left p-2'>Cnt</th>
							<th className='text-left p-2'>Precio</th>
							<th className='text-left p-2'>Total</th>
						</tr>
					</thead>

					<tbody>
						{quoteData?.experiments?.map((item, index) => (
							<tr
								key={index}
								className='hover:bg-slate-50 text-xs font-medium dark:hover:bg-gray-700 transition-colors dark:text-gray-300 text-slate-600 border-t dark:border-t-gray-700'>
								<td className='p-2 flex flex-col'>
									<span className={`${item?.experiment?.deletedAt ? 'line-through dark:text-red-400' : ''}`}>
										{item?.experiment?.name}
									</span>
								</td>
								<td
									className={`break-words p-2 ${item?.experiment?.category?.deletedAt ? 'line-through dark:text-red-400' : ''}`}>
									{item?.experiment?.category?.name || '---'}
								</td>
								<td
									className={`break-words p-2 ${item?.experiment?.category?.deletedAt ? 'line-through dark:text-red-400' : ''}`}>
									{item?.experiment?.amount}
								</td>
								<td
									className={`break-words p-2 ${item?.experiment?.deletedAt ? 'line-through dark:text-red-400' : ''}`}>
									<strong>{item?.experiment?.public_price}</strong>
								</td>
								<td
									className={`break-words p-2 ${item?.experiment?.category?.deletedAt ? 'line-through dark:text-red-400' : ''}`}>
									{typeof item?.experiment?.total_cost === 'number'
										? item.experiment.total_cost.toFixed(2)
										: item?.experiment?.total_cost}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</section>
		</>
	)
}
