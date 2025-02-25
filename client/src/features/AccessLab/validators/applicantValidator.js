import { z } from 'zod'
import { isValidCI } from './cli-validator.js'

export const applicant_schema_zod = z.object({
	name: z.string().min(3, 'Mínimo 3 caracteres').max(255, 'Máximo 255 caracteres'),

	dni: z
		.string()
		.optional()
		.refine(val => val.length === 10, {
			message: 'Máximo 10 caracteres.',
		})
		.refine(value => value === '' || isValidCI(value), {
			message: 'Cédula no válida',
		}),

	email: z
		.string()
		.optional()
		.refine(val => val.length >= 3, {
			message: 'El correo es requerido.',
		})
		.refine(val => val.length <= 100, {
			message: 'El correo no puede superar los 100 caracteres.',
		})
		.refine(val => z.string().email().safeParse(val).success, {
			message: 'Correo electrónico no válido',
		}),
})
