import { useState, useEffect } from 'react'

export const SpinnerLoading = ({ text, isLoading }) => {
	const [fadeOut, setFadeOut] = useState(false)

	useEffect(() => {
		if (!isLoading) {
			setFadeOut(true)
			setTimeout(() => {
				setFadeOut(false)
			}, 500)
		}
	}, [isLoading])

	return (
		<>
			<div
				className={`flex flex-col items-center transition-opacity duration-500 ${
					fadeOut ? 'opacity-0' : 'opacity-100'
				}`}>
				<div className='relative flex flex-col items-center gap-y-4 text-slate-500 dark:text-gray-300'>
					<span className='loading loading-dots loading-lg'></span>
				</div>
				{text && (
					<span className='mt-2 text-sm font-medium text-slate-500 dark:text-gray-300'>
						{text ? text : 'Por favor, espera un momento :)'}
					</span>
				)}
			</div>
		</>
	)
}
