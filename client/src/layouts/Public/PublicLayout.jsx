const PublicLayout = ({ children }) => {
	return (
		<>
			<div className='min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-gray-800'>
				{children}
			</div>
		</>
	)
}

export { PublicLayout }
