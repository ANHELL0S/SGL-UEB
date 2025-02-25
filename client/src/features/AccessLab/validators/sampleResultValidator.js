import { z } from 'zod'

export const sample_result_schema_zod = z.object({
	analysis: z.string().uuid({ message: 'Selecciona un análisis.' }),
	result: z
		.string()
		.min(1, 'Por favor, ingresa un número')
		.max(10, 'Máximo 10 dígitos')
		.refine(val => /^\d+(\.\d+)?$/.test(val), {
			message: 'Solo se permiten números.',
		})
		.refine(
			val => {
				if (val.includes('.')) {
					const decimals = val.split('.')[1]
					return decimals.length <= 5
				}
				return true
			},
			{ message: 'Máximo 2 decimales.' }
		),
})
