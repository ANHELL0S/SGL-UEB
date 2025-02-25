import { z } from 'zod'
import { SAMPLE_STATUS } from '../../../../shared/constants/sample-const.js'

export const params_schema_zod = z.object({
	id: z.string().uuid({ message: 'ID no válida.' }),
})

export const sample_schema_zod = z.object({
	quote: z.string().uuid({ message: 'ID no válida.' }),

	name: z.string().min(3, 'Mínimo 3 caracteres').max(255, 'Máximo 255 caracteres'),

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

	container: z.string().min(3, 'Mínimo 3 caracteres').max(255, 'Máximo 255 caracteres'),

	unit_measurement: z.string().uuid({ message: 'Selecciona una unidad de medida.' }),
	status: z.string().min(3, 'Mínimo 3 caracteres').max(255, 'Máximo 255 caracteres'),
})

export const sample_status_schema_zod = z.object({
	status: z.enum([SAMPLE_STATUS.PENDING, SAMPLE_STATUS.APPROVED, SAMPLE_STATUS.REJECTED]),
})
