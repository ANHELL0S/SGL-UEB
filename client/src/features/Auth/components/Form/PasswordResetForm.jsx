import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { InputFieldZod } from '../../../../components/Input/InputFieldZod'
import { Button } from '../../../../components/Button/Button'
import { ToastGeneric } from '../../../../components/Toasts/Toast'
import { resetPasswordRequest } from '../../../../services/api/auth.api'
import { changePasswordSchema } from '../../../../validators/auth.validator'

const PasswordResetForm = ({ decodedToken, token, onSuccess }) => {
	const [loading, setLoading] = useState(false)
	const [showPassword, setShowPassword] = useState(false)

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(changePasswordSchema),
	})

	const handleFormSubmit = async data => {
		console.log(data)
		setLoading(true)

		try {
			const response = await resetPasswordRequest(decodedToken.id, {
				token,
				newPassword: data.newPassword, // Ensure data matches field names
				confirmPassword: data.confirmPassword,
			})

			ToastGeneric({ type: 'success', message: response.message })
			onSuccess()
		} catch (error) {
			ToastGeneric({ type: 'error', message: error.message })
		} finally {
			setLoading(false)
		}
	}

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
			<div className='space-y-5 text-sm'>
				<div>
					<label htmlFor='password' className='block font-medium text-slate-500'>
						Nueva contraseña
					</label>
					<input
						id='password'
						type={showPassword ? 'text' : 'password'}
						placeholder='********'
						{...register('newPassword')}
						className={`mt-1 block w-full px-3 py-2 border-2 ${
							errors.newPassword ? 'border-red-500 placeholder:text-transparent' : 'border-slate-300'
						} bg-slate-50 focus:outline-none focus:border-2 rounded-2xl focus:border-slate-500 transition-colors duration-300 text-slate-600`}
					/>

					{errors.password && <p className='text-red-500 text-xs mt-1'>{errors.password.message}</p>}
				</div>

				<div>
					<label htmlFor='confirmPassword' className='block font-medium text-slate-500'>
						Confirmar nueva contraseña
					</label>
					<input
						id='confirmPassword'
						type={showPassword ? 'text' : 'password'}
						placeholder='********'
						{...register('confirmPassword')}
						className={`mt-1 block w-full px-3 py-2 border-2 ${
							errors.confirmPassword ? 'border-red-500 placeholder:text-transparent' : 'border-slate-300'
						} bg-slate-50 focus:outline-none focus:border-2 rounded-2xl focus:border-slate-500 transition-colors duration-300 text-slate-600`}
					/>

					{errors.confirmPassword && <p className='text-red-500 text-xs mt-1'>{errors.confirmPassword.message}</p>}
				</div>
			</div>

			<div className='flex gap-4 flex-col'>
				<Button type='submit' variant='primary' size='normal' loading={loading}>
					{loading ? 'Procesando...' : 'Confirmar'}
				</Button>
				<Button type='button' variant='none' size='normal' onClick={() => setShowPassword(!showPassword)}>
					{showPassword ? 'Ocultar Contraseñas' : 'Mostrar Contraseñas'}
				</Button>
			</div>
		</form>
	)
}

export { PasswordResetForm }
