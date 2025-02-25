import { BiArrowBack } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/Button/Button'
import pathimg from '@/assets/images/404_error.svg'
import { PATH_PRIVATE } from '@/helpers/constants.helper'

const NotFoundSection = () => {
	const navigate = useNavigate()
	const goBack = () => window.history.back()
	const goToDashboard = () => navigate(PATH_PRIVATE.DASHBOARD)

	return (
		<>
			<section className='flex flex-col items-center h-screen justify-center px-4 sm:px-6 lg:px-8'>
				<div className='container flex flex-col-reverse lg:flex-row lg:items-center lg:gap-4'>
					<div className='w-full text-center text-slate-600 dark:text-gray-300 lg:text-left lg:w-1/2'>
						<h1 className='mt-3 text-2xl font-semibold md:text-3xl'>Página no encontrada</h1>

						<p className='mt-4 font-medium text-slate-500 dark:text-gray-400'>
							Lo sentimos, la página que estás buscando no existe. Aquí hay algunos enlaces útiles:
						</p>

						<div className='mt-6 flex flex-col items-center gap-y-3 sm:flex-row sm:gap-x-3'>
							<Button variant='primary' onClick={goToDashboard} size='small'>
								Llevar al inicio
							</Button>

							<Button variant='none' onClick={goBack} size='small'>
								<BiArrowBack size={14} className='mr-2' /> Volver atrás
							</Button>
						</div>
					</div>

					<div className='relative w-full lg:mt-0 lg:w-1/2'>
						<img className='w-full max-w-sm mx-auto lg:max-w-lg' src={pathimg} alt='404' />
					</div>
				</div>
			</section>
		</>
	)
}

export { NotFoundSection }
