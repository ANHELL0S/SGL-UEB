import { z } from 'zod'

export const params_schema_zod = z.object({
	id: z.string().uuid({ message: 'ID no válida.' }),
})

export const consumption_schema_zod = z.object({
	quote: z.string().uuid({ message: 'ID no válida.' }),

	reactive: z.string().uuid({ message: 'Selecciona el rectivo.' }),

	lab: z.string().uuid({ message: 'Selecciona el laboratorio.' }),

	analysis: z.string().uuid({ message: 'Selecciona el análisis.' }),

	amount: z
		.string({
			required_error: 'Cantidad es requerida.',
			invalid_type_error: 'Cantidad debe ser un número.',
		})
		.min(1, 'Ingresa un número')
		.max(10, 'Máximo 10 dígitos')
		.refine(val => /^\d{1,7}(\.\d{1,5})?$/.test(val), {
			message: 'Máximo 5 decimales.',
		})
		.refine(val => !isNaN(parseFloat(val)) && isFinite(val), {
			message: 'Debe ser un número válido.',
		}),
})

export const consumption_independent_schema_zod = z.object({
	reactive: z.string().uuid({ message: 'Selecciona el rectivo.' }),

	lab: z.string().uuid({ message: 'Selecciona el laboratorio.' }),

	analysis: z.string().uuid({ message: 'Selecciona un análisis.' }),

	amount: z
		.string({
			required_error: 'Cantidad es requerida.',
			invalid_type_error: 'Cantidad debe ser un número.',
		})
		.min(1, 'Ingresa un número')
		.max(10, 'Máximo 10 dígitos')
		.refine(val => /^\d{1,7}(\.\d{1,5})?$/.test(val), {
			message: 'Máximo 5 decimales.',
		})
		.refine(val => !isNaN(parseFloat(val)) && isFinite(val), {
			message: 'Debe ser un número válido.',
		}),

	notes: z.string().min(3, 'Mínimo 3 caracteres').max(1000, 'Máximo 1000 caracteres'),
})
