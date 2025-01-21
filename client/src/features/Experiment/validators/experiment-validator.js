import { z } from 'zod'

export const experiment_schema_zod = z.object({
	name: z
		.string()
		.min(3, 'El nombre debe tener al menos 3 caracteres')
		.max(255, 'El nombre debe tener maximo 255 caracteres'),

	public_price: z
		.string({
			required_error: 'Precio público es requerido.',
			invalid_type_error: 'Precio público debe ser un número.',
		})
		.min(1, 'Por favor, ingresa un número')
		.max(99999, 'Máximo 10 dígitos')
		.refine(val => /^(\d+(\.\d*)?|\.\d+)$/.test(val), {
			message: 'Debe ser número.',
		}),

	internal_price: z
		.string({
			required_error: 'Precio interno es requerido.',
			invalid_type_error: 'Precio interno debe ser un número.',
		})
		.min(1, 'Por favor, ingresa un número')
		.max(99999, 'Máximo 10 dígitos')
		.refine(val => /^(\d+(\.\d*)?|\.\d+)$/.test(val), {
			message: 'Debe ser número.',
		}),
})
