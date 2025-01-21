import { z } from 'zod'

export const signInSchemaZod = z.object({
	email: z.string().email('El correo electrónico debe ser válido'),
	password: z.string().min(12, 'La contraseña debe tener al menos 12 caracteres'),
})
