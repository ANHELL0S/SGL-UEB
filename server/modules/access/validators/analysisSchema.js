import { z } from 'zod'

export const params_schema_zod = z.object({
	id: z.string().uuid({ message: 'ID no válida.' }),
})

export const analysis_schema_zod = z.object({
	experiments: z
		.array(
			z.object({
				id: z.string(),
				amount: z.number().min(1, 'Debe ser al menos 1'),
			})
		)
		.min(1, 'Selecciona al menos un análisis.'),
	access: z.string().uuid({ message: 'ID de acceso no válida.' }),
})
