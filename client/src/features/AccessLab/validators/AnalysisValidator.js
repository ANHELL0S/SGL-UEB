import { z } from 'zod'

export const analysis_schema_zod = z.object({
	experiments: z
		.array(
			z.object({
				id: z.string(),
				amount: z.number().min(1, 'Debe ser al menos 1'),
			})
		)
		.min(1, 'Selecciona al menos un análisis.'),
})
