import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../../../../components/Button/Button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../../../../context/AuthContext'
import { InputFieldZod } from '../../../../components/Input/InputFieldZod'
import { authSchema } from '../../../../validators/auth.validator'

const SigningForm = () => {
	const { signing } = useAuth()
	const [loading, setLoading] = useState(false)

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm({
		resolver: zodResolver(authSchema),
	})

	const handleFormSigningSubmit = async data => {
		setLoading(true)
		try {
			await signing(data.email, data.password)
		} catch (error) {
		} finally {
			setLoading(false)
		}
	}

	return (
		<form onSubmit={handleSubmit(handleFormSigningSubmit)}>
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

				<div>
					<label htmlFor='password' className='block font-medium text-slate-500'>
						Contraseña
					</label>
					<input
						id='password'
						type='password'
						placeholder='********'
						{...register('password')}
						className={`mt-1 block w-full px-3 py-2 border-2 ${
							errors.password ? 'border-red-500 placeholder:text-transparent' : 'border-slate-300'
						} bg-slate-50 focus:outline-none focus:border-2 rounded-2xl focus:border-slate-500 transition-colors duration-300 text-slate-600`}
					/>
					{errors.password && <p className='text-red-500 text-xs mt-1'>{errors.password.message}</p>}
				</div>

				<button
					type='submit'
					className={`p-3 font-medium text-white bg-slate-700 rounded-2xl shadow w-full transition-all duration-300 ${
						!isValid || loading ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-800'
					}`}
					disabled={!isValid || loading}>
					{loading ? 'Cargando...' : 'Iniciar Sesión'}
				</button>
			</div>
		</form>
	)
}

export { SigningForm }
