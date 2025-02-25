import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PATH_AUTH } from '../../helpers/constants.helper.js'
import { ToastGeneric } from '../../components/Toasts/Toast.jsx'
import { PasswordResetForm } from './components/Form/PasswordResetForm.jsx'
import { TimeOutResetPassword } from './components/Banner/TimeOutResetPassword.jsx'
import { ImageCarousel } from './components/Banner/AuthCarousel.jsx'

const PasswordResetSection = () => {
	const { token } = useParams()
	const navigate = useNavigate()
	const [tokenExpired, setTokenExpired] = useState(false)
	const [decodedToken, setDecodedToken] = useState(null)
	const [timeLeft, setTimeLeft] = useState(null)
	const [isSuccess, setIsSuccess] = useState(false)

	useEffect(() => {
		try {
			const decoded = JSON.parse(atob(token.split('.')[1]))
			const tokenExpiration = decoded.exp * 1000

			if (Date.now() > tokenExpiration) {
				setTokenExpired(true)
			} else {
				setDecodedToken(decoded)
				setTimeLeft(Math.max(0, tokenExpiration - Date.now()))

				const intervalId = setInterval(() => {
					const remaining = tokenExpiration - Date.now()
					if (remaining <= 0) {
						setTokenExpired(true)
						clearInterval(intervalId)
					} else {
						setTimeLeft(remaining)
					}
				}, 1000)

				return () => clearInterval(intervalId)
			}
		} catch (error) {
			setTokenExpired(true)
			ToastGeneric({ type: 'error', message: 'Token inválido o expirado.' })
		}
	}, [token])

	const formatTime = ms => {
		const minutes = Math.floor(ms / 60000)
		const seconds = Math.floor((ms % 60000) / 1000)
		return `${minutes}:${seconds.toString().padStart(2, '0')}`
	}

	const handleSuccess = () => {
		setIsSuccess(true)
		setTimeLeft(null)
		navigate(PATH_AUTH.LOGIN)
	}

	if (tokenExpired) return <TimeOutResetPassword />

	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-slate-50'>
			<div className='grid md:grid-cols-2 items-center'>
				{/* Right Section */}
				<ImageCarousel />

				<div className='max-w-md p-10 mx-auto flex flex-col gap-4'>
					<div className='flex items-center justify-center p-3 mx-auto'>
						{timeLeft !== null && (
							<p className='text-center text-neutral-600 text-sm flex font-semibold flex-col'>
								<span className='text-xl'>{formatTime(timeLeft)}</span>
								<span className='font-medium'>Tiempo restante</span>
							</p>
						)}
					</div>

					<h3 className='text-neutral-700 text-3xl font-extrabold text-center'>Restablecer contraseña</h3>

					<PasswordResetForm decodedToken={decodedToken} token={token} onSuccess={handleSuccess} />
				</div>
			</div>
		</div>
	)
}

export { PasswordResetSection }
