import { z } from 'zod'

export const category_schema_zod = z.object({
	name: z.string().min(3, 'Minimo 3 caracteres').max(255, 'Maximo 255 caracteres'),
})
