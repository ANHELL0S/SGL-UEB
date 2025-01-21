import { z } from 'zod'

export const user_zod = z.object({
	names: z
		.string()
		.min(3, { message: 'El nombre debe tener al menos 3 caracteres' })
		.max(250, { message: 'El nombre no puede tener más de 250 caracteres' }),

	email: z.string().email({ message: 'Ingrese un correo electrónico válido' }),

	phone: z
		.string()
		.regex(/^[0-9]{10}$/, { message: 'Ingrese un número de teléfono válido (10 dígitos)' })
		.max(10, { message: 'El número de teléfono no puede tener más de 10 dígitos' }),

	dni: z
		.string()
		.regex(/^[0-9]{10}$/, { message: 'Ingrese una cédula válida (10 dígitos)' })
		.length(10, { message: 'La cédula debe tener exactamente 10 dígitos' }),

	code: z
		.string()
		.min(3, { message: 'El código debe tener al menos 3 caracteres' })
		.max(255, { message: 'El código no puede tener más de 255 caracteres' })
		.regex(/^[a-zA-Z]+$/, { message: 'El código solo puede contener letras' }),
})

export const manager_user_roles_zod = z.object({
	names: z
		.string()
		.min(3, { message: 'El nombre debe tener al menos 3 caracteres' })
		.max(250, { message: 'El nombre no puede tener más de 250 caracteres' }),

	email: z.string().email({ message: 'Ingrese un correo electrónico válido' }),

	phone: z
		.string()
		.regex(/^[0-9]{10}$/, { message: 'Ingrese un número de teléfono válido (10 dígitos)' })
		.max(10, { message: 'El número de teléfono no puede tener más de 10 dígitos' }),

	dni: z
		.string()
		.regex(/^[0-9]{10}$/, { message: 'Ingrese una cédula válida (10 dígitos)' })
		.length(10, { message: 'La cédula debe tener exactamente 10 dígitos' }),

	code: z
		.string()
		.min(3, { message: 'El código debe tener al menos 3 caracteres' })
		.max(255, { message: 'El código no puede tener más de 255 caracteres' })
		.regex(/^[a-zA-Z]+$/, { message: 'El código solo puede contener letras' }),
})
