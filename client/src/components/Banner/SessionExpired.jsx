import { Button } from '../Button/Button'
import { ToastGeneric } from '../Toasts/Toast'
import { useAuth } from '../../context/AuthContext'

export const SessionExpiredModal = ({ show, onClose }) => {
	if (!show) return null

	const { logout } = useAuth()

	const handleLogout = () => {
		logout()
		ToastGeneric({ type: 'info', message: 'Tu sesión ha caducado. Has sido desconectado.' })
		onClose()
	}

	return (
		<>
			<div className='fixed inset-0 bg-slate-50 flex justify-center items-center z-50'>
				<div className='border-2 p-4 rounded-xl m-8'>
					<h1 className='mt-3 text-2xl font-semibold md:text-2xl text-slate-600'>Sesión caducada</h1>

					<p className='mt-4 font-medium text-sm text-slate-500'>
						Lo sentimos, tu sesión ha expirado. Por favor, inicia sesión de nuevo.
					</p>

					<div className='mt-6 flex flex-col items-center gap-y-3 sm:flex-row sm:gap-x-3'>
						<Button
							variant='secondary'
							onClick={handleLogout}
							size='small'
							className='bg-blue-600 hover:bg-blue-700 text-white'>
							Iniciar sesión
						</Button>
					</div>
				</div>
			</div>
		</>
	)
}
