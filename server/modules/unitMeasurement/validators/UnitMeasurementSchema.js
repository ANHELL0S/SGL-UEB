import { z } from 'zod'

export const params_schema_zod = z.object({
	id: z.string().uuid({ message: 'ID no válida.' }),
})

export const unit_measurement_schema_zod = z.object({
	name: z
		.string()
		.min(3, 'El nombre debe tener al menos 3 caracteres')
		.max(255, 'El nombre debe tener maximo 255 caracteres'),
	unit: z
		.string()
		.min(1, 'La unidad debe tener al menos 1 caracter')
		.max(255, 'La unidad debe tener maximo 255 caracter'),
})
