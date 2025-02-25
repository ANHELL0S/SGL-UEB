import { z } from 'zod'

export const params_schema_zod = z.object({
	id: z.string().uuid({ message: 'ID no válida.' }),
})

export const analysis_schema_zod = z.object({
	labs: z
		.array(
			z.object({
				id: z.string(),
			})
		)
		.min(1, 'Selecciona al menos un laboratorio.'),
	access: z.string().uuid({ message: 'ID no válida.' }),
})
