import { z } from 'zod'

export const asignedLab_schema_zod = z.object({
	labs: z
		.array(
			z.object({
				id: z.string(),
			})
		)
		.min(1, 'Selecciona al menos un laboratorio.'),
})
