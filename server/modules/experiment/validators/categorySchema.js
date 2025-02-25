import { z } from 'zod'

export const params_schema_zod = z.object({
	id: z.string().uuid({ message: 'ID no válida.' }),
})

export const category_schema_zod = z.object({
	name: z
		.string()
		.min(3, 'El nombre debe tener al menos 3 caracteres')
		.max(255, 'El nombre debe tener maximo 255 caracteres'),
})
