import { z } from 'zod'

export const reactive_schema_zod = z.object({
	name: z.string().min(3, 'Minimo 3 caracteres').max(255, 'Maximo 255 caracteres'),

	code: z.string().min(3, 'Minimo 3 caracteres').max(255, 'Maximo 255 caracteres'),

	number_of_containers: z.string().min(1, 'Minimo 1 carácter'),
	initial_quantity: z.string().min(1, 'Minimo 1 carácter'),
	current_quantity: z.string().min(1, 'Minimo 1 carácter'),
	quantity_consumed: z.string().min(1, 'Minimo 1 carácter'),

	unit: z.string().uuid('Debe ser un UUID válido'),

	cas: z.string().optional(),

	expiration_date: z
		.string()
		.optional()
		.refine(date => {
			if (!date) return true // Permitir vacío
			return new Date(date) > new Date() // Comparar directamente
		}, 'La fecha de expiración debe ser una fecha futura o vacía'),

	is_controlled: z
		.union([z.literal('true'), z.literal('false')])
		.transform(val => val === 'true') // Transforma el string a booleano
		.refine(val => typeof val === 'boolean', {
			message: 'Por favor selecciona una opción válida.',
		}),
})
