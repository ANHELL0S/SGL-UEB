import { Button } from '../../../../components/Button/Button'
import { Link, useNavigate } from 'react-router-dom'
import path_img from '../../../../assets/images/time_out_password.svg'
import { PATH_PRIVATE, PATH_AUTH } from '../../../../helpers/constants.helper'
import { BiArrowBack } from 'react-icons/bi'

const TimeOutResetPassword = ({
	title = 'Tiempo agotado',
	message = 'Estimado usuario, lamentamos informarte que el enlace para restablecer tu contraseña ha expirado. Por favor, solicita un nuevo enlace para continuar con el proceso.',
}) => {
	const navigate = useNavigate()
	return (
		<>
			<div className='mx-auto lg:flex lg:items-center lg:gap-12'>
				<div className='text-slate-00 w-full lg:w-1/2 flex flex-col gap-2'>
					<h1 className='text-2xl font-semibold text-neutral-600 md:text-2xl'>{title}</h1>
					<p className='text-slate-500 font-medium text-sm'>{message}</p>

					<div className='flex md:flex-row flex-col items-center justify-between gap-4'>
						<button
							onClick={() => navigate(PATH_AUTH.RECOVER_ACCOUNT)}
							className='p-3 font-medium text-white bg-slate-700 rounded-2xl shadow w-full transition-all duration-300'>
							Solicitar nuevo enlace
						</button>
					</div>
				</div>

				<div className='flex items-center justify-center w-full lg:mt-0 lg:w-1/2'>
					<img className='w-full max-w-lg lg:mx-auto' src={path_img} alt={title} />
				</div>
			</div>
		</>
	)
}

export { TimeOutResetPassword }
