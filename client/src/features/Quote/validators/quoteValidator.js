import { z } from 'zod'
import { isValidCI } from './cli-validator.js'

export const quote_schema_zod = z.object({
	experiments: z
		.array(
			z.object({
				id: z.string(),
				amount: z.number().min(1, 'Debe ser al menos 1'),
			})
		)
		.min(1, 'Selecciona al menos un análisis.'),

	type_sample: z.string().min(3, 'Mínimo 3 caracteres').max(255, 'Máximo 255 caracteres'),

	amount_sample: z
		.string({
			required_error: 'Precio público es requerido.',
		})
		.min(1, 'Por favor, ingresa un número')
		.max(10, 'Máximo 10 dígitos')
		.refine(val => /^\d+$/.test(val), {
			message: 'Debe ser un número entero.',
		}),

	detail_sample: z.string().min(3, 'Mínimo 3 caracteres').max(255, 'Máximo 255 caracteres'),

	name: z.string().min(3, 'Mínimo 3 caracteres').max(255, 'Máximo 255 caracteres'),

	dni: z
		.string()
		.length(10, { message: 'Debe tener exactamente 10 caracteres.' })
		.refine(value => isValidCI(value), 'Cédula no válida'),

	email: z
		.string()
		.min(3, 'Mínimo 3 caracteres')
		.max(100, 'Máximo 100 caracteres')
		.email('Correo electrónico no válido'),

	direction: z.string().min(3, 'Mínimo 3 caracteres').max(255, 'Máximo 255 caracteres'),

	phone: z
		.string()
		.refine(value => /^\d+$/.test(value), { message: 'Celular inválido.' })
		.refine(value => value.length === 10, { message: 'Debe contener exactamente 10 dígitos.' }),
})

export const bill_status_schema_zod = z.object({
	bill: z
		.string()
		.max(255, 'Máximo 255 caracteres')
		.optional()
		.refine(value => value === undefined || value.trim() === '' || value.length >= 3, {
			message: 'Minimo 3 caracteres',
		}),
})
