export const InputFieldZod = ({ label, placeholder, type = 'text', register, error, required = true }) => (
	<>
		<div className='flex flex-col gap-y-1.5 w-full text-xs font-medium text-slate-500 dark:text-gray-300'>
			<div className='flex gap-x-1'>
				<label className={`${error ? 'text-red-500' : ''}`}>{label}</label>
				{required && <span className='text-red-500'>*</span>}
			</div>

			<input
				{...register}
				type={type}
				placeholder={placeholder}
				className={`w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2 focus:border-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-500 dark:text-gray-100 text-slate-600 ${error ? 'dark:text-red-400 border-red-100 dark:border-red-400 dark:bg-red-400/5 bg-red-400/5 placeholder:text-red-400/0' : ''}`}
			/>

			<div className='text-red-500 text-xs flex items-start gap-1 font-normal'>{error && <p>{error.message}</p>}</div>
		</div>
	</>
)
