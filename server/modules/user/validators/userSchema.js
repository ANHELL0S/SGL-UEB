import { z } from 'zod'
import { isValidCI } from '../../../shared/validators/cli-validator.js'

export const params_schema_zod = z.object({
	id: z.string().uuid({ message: 'ID no válida.' }),
})

export const user_schema_zod = z.object({
	names: z
		.string()
		.min(3, 'El nombre completo debe tener al menos 3 caracteres')
		.max(255, 'El nombre completo debe tener maximo 255 caracteres'),
	email: z.string().email('El correo debe ser válido').max(255, 'El correo debe tener maximo 255 caracteres'),
	phone: z
		.string()
		.regex(/^[0-9]{10}$/, 'El teléfono debe tener 10 dígitos')
		.max(10, 'El teléfono debe tener maximo 10 dígitos'),
	dni: z
		.string()
		.length(10, { message: 'La cédula debe tener 10 caracteres.' })
		.refine(value => isValidCI(value), 'La cédula no es válida'),
	code: z
		.string()
		.min(3, 'El código debe tener al menos 3 caracteres')
		.max(255, 'El código debe tener maximo 255 caracteres'),
})

export const manager_user_roles_zod = z.object({
	id_user: z.string().uuid({ message: 'ID no válida.' }),
	roles: z.array(z.string().uuid()).min(1, 'Debe seleccionar al menos un rol'),
})

export const user_status_schema_zod = z.object({
	active: z.boolean(),
})

export const user_password_schema_zod = z
	.object({
		currentPassword: z
			.string({
				required_error: 'La contraseña actual es obligatoria.',
			})
			.min(8, 'La nueva contraseña debe tener al menos 8 caracteres.')
			.max(20, 'La nueva contraseña no puede tener más de 20 caracteres.'),
		newPassword: z
			.string({
				required_error: 'La nueva contraseña es obligatoria.',
			})
			.min(8, 'La nueva contraseña debe tener al menos 8 caracteres.')
			.max(20, 'La nueva contraseña no puede tener más de 20 caracteres.')
			.refine(val => /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(val), {
				message: 'La contraseña debe contener al menos una letra mayúscula, un número y un carácter especial.',
			}),
		confirmPassword: z
			.string()
			.min(8, 'La nueva contraseña debe tener al menos 8 caracteres.')
			.max(20, 'La nueva contraseña no puede tener más de 20 caracteres.')
			.refine(val => /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(val), {
				message: 'La contraseña debe contener al menos una letra mayúscula, un número y un carácter especial.',
			}),
	})
	.refine(
		values => {
			return values.newPassword === values.confirmPassword
		},
		{
			message: 'Las contraseñas no coinciden',
			path: ['confirmPassword'],
		}
	)
