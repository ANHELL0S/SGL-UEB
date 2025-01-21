import { z } from 'zod'
import { isValidCI } from './cli-validator.js'

export const accessLab_schema_zod = z.object({
	type_access: z.string().refine(value => value === 'access_internal' || value === 'access_external', {
		message: 'Escoge el tipo de acceso',
	}),

	faculty: z.string().uuid({ message: 'Selecciona la facultad' }),

	career: z.string().uuid({ message: 'Selecciona la carrera' }),

	reason: z.string().min(3, 'Minimo 3 caracteres').max(255, 'Máximo 255 caracteres'),

	observations: z.string().min(3, 'Minimo 3 caracteres').max(2000, 'Máximo 2000 caracteres').optional(),

	topic: z.string().min(3, 'Minimo 3 caracteres').max(2000, 'Máximo 2000 caracteres'),

	startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/, 'Hora invalida (HH:MM)'),

	endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/, 'Hora invalida (HH:MM)'),

	director: z.object({
		name: z.string().min(3, 'Mínimo 3 caracteres').max(255, 'Máximo 255 caracteres'),
		dni: z
			.string()
			.length(10, { message: 'Debe tener exactamente 10 caracteres.' })
			.refine(value => isValidCI(value), 'Cédula no válida'),
		email: z
			.string()
			.min(3, 'Mínimo 3 caracteres')
			.max(100, 'Máximo 100 caracteres')
			.email('Correo electrónico no válido'),
	}),

	applicant: z.array(
		z.object({
			name: z.string().min(3, 'Minimo 3 caracteres').max(255, 'Máximo 255 caracteres'),
			dni: z
				.string()
				.length(10, { message: 'Minimo/Máximo 10 caracteres.' })
				.refine(value => isValidCI(value), 'Cédula no válida'),
			email: z
				.string()
				.min(3, 'Mínimo 3 caracteres')
				.max(100, 'Máximo 100 caracteres')
				.email('Correo electrónico no válido'),
		})
	),

	labs: z.array(z.string()).min(1, 'Selecciona al menos un laboratorio'),

	attached: z.string().min(3, 'Minimo 3 caracteres').max(2000, 'Máximo 2000 caracteres'),

	analysis_required: z.string().min(3, 'Minimo 3 caracteres').max(2000, 'Máximo 2000 caracteres'),
})
