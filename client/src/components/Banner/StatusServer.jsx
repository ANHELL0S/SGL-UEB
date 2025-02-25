import img_500_server from '../../assets/images/500_server.svg'

export const Status500 = ({ data }) => {
	return (
		<div className='flex flex-col items-center justify-center min-h-screen md:pt-0 pt-12 lg:flex-row lg:gap-12'>
			<div className='text-start lg:text-left w-full lg:w-1/2'>
				<h1 className='text-md font-bold text-slate-500 dark:text-gray-300 uppercase'>
					{data?.status || 'Error'} {data?.code || 500}
				</h1>
				<p className='mt-3 text-2xl font-semibold text-yellow-500 md:text-2xl'>
					{data?.message || '¡Ops! Ha ocurrido un error. Intentalo más tarde.'}
				</p>
				<p className='mt-4 font-medium text-slate-500 dark:text-gray-300 text-sm'>
					Estimado usuario, ha ocurrido un error en nuestro sistema. Estamos trabajando para solucionarlo. Gracias por
					tu paciencia.
				</p>
			</div>

			<div className='mt-8 lg:mt-0 w-full max-w-sm lg:max-w-md lg:w-1/2'>
				<img className='w-full mx-auto' src={img_500_server} alt='Error 500' />
			</div>
		</div>
	)
}
