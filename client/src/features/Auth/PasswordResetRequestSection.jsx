import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/Button/Button'
import { PATH_AUTH } from '../../helpers/constants.helper'
import { BiArrowBack, BiEnvelope, BiLockAlt } from 'react-icons/bi'
import { PasswordResetRequestForm } from './components/Form/PasswordResetRequestForm'
import { ImageCarousel } from './components/Banner/AuthCarousel'

const PasswordResetRequestSection = () => {
	const [emailSent, setEmailSent] = useState('')
	const [requestSent, setRequestSent] = useState(false)

	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-slate-50'>
			<div className='grid md:grid-cols-2 items-center'>
				{/* Right Section */}
				<ImageCarousel />

				{/* Left Section */}
				{requestSent ? (
					<>
						<div className='max-w-md p-10 mx-auto flex flex-col gap-4'>
							<h3 className='text-slate-700 text-3xl font-bold'>Verifica tu email</h3>

							<p className='text-slate-500 text-sm leading-relaxed text-start'>
								Se ha enviado un enlace para restablecer tu contraseña a <strong>{emailSent}</strong>
							</p>
							<div className='flex justify-end gap-4 flex-col'>
								<a href='https://mail.google.com/mail/u/0/?pli=1#inbox'>
									<button
										type='submit'
										className='p-3 font-medium text-white bg-slate-700 rounded-2xl shadow w-full transition-all duration-300'>
										Ir a Gmail
									</button>
								</a>

								<Link
									to={PATH_AUTH.LOGIN}
									className='p-3 flex justify-center items-center gap-2 font-medium text-slate-500 w-full transition-all duration-300'>
									<BiArrowBack />
									Regresar
								</Link>
							</div>
						</div>
					</>
				) : (
					<>
						<div className='max-w-md p-10 mx-auto flex flex-col gap-4'>
							<h3 className='text-slate-700 text-3xl font-bold'>Recuperar contraseña</h3>
							<p className='text-slate-500 text-sm leading-relaxed text-start'>
								Restablece tu contraseña fácilmente para volver a acceder a tu cuenta.
							</p>
							<PasswordResetRequestForm setEmailSent={setEmailSent} setRequestSent={setRequestSent} />
						</div>
					</>
				)}
			</div>
		</div>
	)
}

export { PasswordResetRequestSection }
