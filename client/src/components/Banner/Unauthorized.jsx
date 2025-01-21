import { BiArrowBack } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/Button/Button'
import pathimg from '../../assets/images/Unauthorized.svg'
import { PATH_PRIVATE } from '../../helpers/constants.helper'

export const Unauthorized = () => {
	const navigate = useNavigate()
	const goBack = () => window.history.back()
	const goToDashboard = () => navigate(PATH_PRIVATE.DASHBOARD)

	return (
		<>
			<div className='flex items-center h-screen justify-center px-4 sm:px-6 lg:px-8'>
				<div className='w-full text-center text-neutral-700 dark:text-neutral-300 lg:text-left lg:w-1/2'>
					<h1 className='mt-3 text-2xl font-semibold md:text-3xl text-red-500 dark:text-red-400'>
						Acceso no autorizado
					</h1>

					<p className='mt-4 font-medium text-sm text-neutral-500 dark:text-neutral-400'>
						Lo sentimos, no tienes los permisos para acceder a esta sección. Si crees que esto es un error, por favor
						contacta al administrador.
						<br />
						Mientras tanto, aquí tienes algunos enlaces útiles:
					</p>

					<div className='mt-6 flex flex-col items-center gap-y-3 sm:flex-row sm:gap-x-3'>
						<Button
							variant='primary'
							onClick={goToDashboard}
							size='small'
							className='bg-blue-600 hover:bg-blue-700 text-white'>
							Llevar al inicio
						</Button>

						<Button
							variant='none'
							onClick={goBack}
							size='small'
							className='bg-neutral-200 hover:bg-neutral-300 text-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-300'>
							<BiArrowBack size={14} className='mr-2' /> Volver atrás
						</Button>
					</div>
				</div>

				<div className='relative w-full lg:mt-0 lg:w-1/2'>
					<img className='w-full max-w-sm mx-auto lg:max-w-lg' src={pathimg} alt='401' />
				</div>
			</div>
		</>
	)
}
