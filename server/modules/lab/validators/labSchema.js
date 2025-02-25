import { z } from 'zod'

export const params_schema_zod = z.object({
	id: z.string().uuid({ message: 'ID no válida.' }),
})

export const assign_analyst_lab_zod = z.object({
	user: z.string().uuid({ message: 'ID no válida.' }),
	lab: z.string().uuid({ message: 'ID no válida.' }),
})

export const lab_schema_zod = z.object({
	name: z
		.string()
		.min(3, 'El nombre debe tener al menos 3 caracteres')
		.max(255, 'El nombre debe tener maximo 255 caracteres'),

	location: z
		.string()
		.min(3, 'La localización debe tener al menos 3 caracteres')
		.max(255, 'La localización debe tener maximo 255 caracteres'),

	description: z
		.string()
		.min(3, 'La descripción debe tener al menos 3 caracteres')
		.max(255, 'La descripción debe tener maximo 255 caracteres'),
})

export const lab_status_schema_zod = z.object({
	active: z.boolean(),
})
