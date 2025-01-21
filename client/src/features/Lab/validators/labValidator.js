import { z } from 'zod'

export const lab_schema_zod = z.object({
	name: z.string().min(3, 'Minimo 3 caracteres').max(255, 'Máximo 255 caracteres'),
	location: z.string().min(3, 'Minimo 3 caracteres').max(255, 'Máximo 255 caracteres').optional(),
	description: z.string().min(3, 'Minimo 3 caracteres').max(255, 'Máximo 255 caracteres'),
})
