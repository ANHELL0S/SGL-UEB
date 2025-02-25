export const WidgetCard = ({ icon: Icon, title, value, color, loading }) => {
	return (
		<>
			{loading ? (
				<>
					<div className='animate-pulse p-3 border dark:border-gray-700 bg-slate-100 dark:bg-gray-700/40 text-slate-600 dark:text-gray-300 rounded-lg flex items-center space-x-3 transition-all duration-300'>
						<div className='p-5 bg-gray-300 dark:bg-gray-600 rounded-full'></div>
						<div className='flex-1 space-y-2'>
							<div className='h-6 bg-gray-300 dark:bg-gray-600 rounded-lg w-5'></div>
							<div className='h-4 bg-gray-300 dark:bg-gray-600 rounded-lg w-1/2'></div>
						</div>
					</div>
				</>
			) : (
				<>
					<div className='p-3 border dark:border-gray-700 bg-slate-100 dark:bg-gray-700/40 text-slate-600 dark:text-gray-300 rounded-lg flex items-center space-x-3 transition-all duration-200'>
						<div className={`p-2 ${color} rounded-full dark:text-gray-700`}>
							<Icon size={24} />
						</div>
						<div>
							<p className='text-xl font-bold'>{value}</p>
							<h4 className='text-sm font-medium'>{title}</h4>
						</div>
					</div>
				</>
			)}
		</>
	)
}
