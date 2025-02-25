import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { BiArrowBack } from 'react-icons/bi'
import { ToastGeneric } from '../../../../components/Toasts/Toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { PATH_AUTH } from '../../../../helpers/constants.helper'
import { passwordResetRequest } from '../../../../services/api/auth.api'
import { requestResetPasswordSchema } from '../../../../validators/auth.validator'

const PasswordResetRequestForm = ({ setEmailSent, setRequestSent }) => {
	const [loading, setLoading] = useState(false)

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm({
		resolver: zodResolver(requestResetPasswordSchema),
	})

	const handleFormSubmit = async data => {
		setLoading(true)

		try {
			const response = await passwordResetRequest({ email: data.email })
			ToastGeneric({ type: 'success', message: response.message })
			setRequestSent(true)
			setEmailSent(data.email)
		} catch (error) {
			ToastGeneric({ type: 'error', message: error.message })
		} finally {
			setLoading(false)
		}
	}

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)}>
			<div className='space-y-5 text-sm'>
				<div>
					<label htmlFor='email' className='block font-medium text-slate-500'>
						E-mail
					</label>
					<input
						id='email'
						type='email'
						placeholder='angelo@gmail.com'
						{...register('email')}
						className={`mt-1 block w-full px-3 py-2 border-2 ${
							errors.email ? 'border-red-500 placeholder:text-transparent' : 'border-slate-300'
						} bg-slate-50 focus:outline-none focus:border-2 rounded-2xl focus:border-slate-500 transition-colors duration-300 text-slate-600`}
					/>
					{errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email.message}</p>}
				</div>

				<div className='flex justify-end gap-4 flex-col'>
					<button
						type='submit'
						className={`p-3 font-medium text-white bg-slate-700 rounded-2xl shadow w-full transition-all duration-300 ${
							!isValid || loading ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-800'
						}`}
						disabled={!isValid || loading}>
						{loading ? 'Procesando...' : 'Siguiente'}
					</button>

					{!loading && (
						<Link
							to={PATH_AUTH.LOGIN}
							className={`p-3 flex justify-center items-center gap-2 font-medium text-slate-500 w-full transition-all duration-300 ${
								loading ? 'opacity-40 cursor-not-allowed' : 'hover:text-slate-600'
							}`}>
							<BiArrowBack />
							Regresar
						</Link>
					)}
				</div>
			</div>
		</form>
	)
}

export { PasswordResetRequestForm }
