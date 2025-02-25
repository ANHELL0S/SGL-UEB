import { z } from 'zod'

export const reactive_schema_zod = z.object({
	name: z.string().min(3, 'Minimo 3 caracteres').max(255, 'Maximo 255 caracteres'),

	code: z.string().min(3, 'Minimo 3 caracteres').max(255, 'Maximo 255 caracteres'),

	number_of_containers: z
		.string({
			required_error: 'Precio público es requerido.',
			invalid_type_error: 'Precio público debe ser un número.',
		})
		.min(1, 'Por favor, ingresa un número')
		.max(10, 'Máximo 10 dígitos')
		.refine(val => /^\d+$/.test(val), {
			message: 'Debe ser un número entero.',
		}),

	current_quantity: z
		.string({
			required_error: 'Precio público es requerido.',
			invalid_type_error: 'Precio público debe ser un número.',
		})
		.min(1, 'Por favor, ingresa un número')
		.max(10, 'Máximo 10 dígitos')
		.refine(val => /^\d{1,7}(\.\d{1,5})?$/.test(val), {
			message: 'Máximo 5 decimales.',
		})
		.refine(val => !isNaN(parseFloat(val)) && isFinite(val), {
			message: 'Debe ser un número válido.',
		}),

	unit: z.string().uuid('Debe ser un UUID válido'),

	cas: z.string().optional(),

	expiration_date: z
		.string()
		.optional()
		.refine(date => {
			if (!date) return true // Permitir vacío
			return new Date(date) > new Date() // Comparar directamente
		}, 'Debe ser una fecha futura.'),

	control_tracking: z.enum(['si', 'no']),
})
