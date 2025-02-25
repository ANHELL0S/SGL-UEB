import { z } from 'zod'

export const params_schema_zod = z.object({
	id: z.string().uuid({ message: 'ID no válida.' }),
})

export const experiment_schema_zod = z.object({
	name: z
		.string()
		.min(1, 'El nombre debe tener al menos 1 caracteres')
		.max(255, 'El nombre debe tener maximo 255 caracteres'),

	public_price: z
		.string({
			required_error: 'Precio público es requerido.',
			invalid_type_error: 'Precio público debe ser un número.',
		})
		.min(1, 'Por favor, ingresa un número')
		.max(10, 'Máximo 10 dígitos')
		.refine(val => /^\d{1,7}(\.\d{1,2})?$/.test(val), {
			message: 'Debe ser un número con hasta 2 decimales.',
		})
		.refine(val => !isNaN(parseFloat(val)) && isFinite(val), {
			message: 'Debe ser un número válido.',
		}),

	category: z.string().uuid({ message: 'ID no válida.' }),
})

export const experiment_status_schema_zod = z.object({
	status: z.boolean(),
})
