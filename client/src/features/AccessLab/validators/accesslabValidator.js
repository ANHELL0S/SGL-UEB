import { z } from 'zod'
import { isValidCI } from './cli-validator.js'

export const accessLab_schema_zod = z.object({
	faculty: z
		.string({
			required_error: 'La facultad es requerida.',
		})
		.max(255, 'Máximo 255 caracteres')
		.optional()
		.refine(val => val.length >= 1 || val === '', {
			message: 'Mínimo 1 caracter',
		}),

	career: z
		.string({
			required_error: 'La carrera es requerida.',
		})
		.max(255, 'Máximo 255 caracteres')
		.optional()
		.refine(val => val.length >= 1 || val === '', {
			message: 'Mínimo 1 caracter',
		}),

	director: z
		.object({
			name: z
				.string()
				.optional()
				.refine(val => val === '' || val.length >= 3, {
					message: 'El nombre del director debe tener al menos 3 caracteres',
				}),
			dni: z
				.string()
				.optional()
				.refine(val => val === '' || val.length === 0 || val.length === 10, {
					message: 'Debe tener exactamente 10 caracteres.',
				})
				.refine(value => value === '' || isValidCI(value), {
					message: 'Cédula no válida',
				}),
			email: z
				.string()
				.optional()
				.refine(val => val === '' || val.length >= 3, {
					message: 'El correo es requerido.',
				})
				.refine(val => val === '' || val.length <= 100, {
					message: 'El correo no puede superar los 100 caracteres.',
				})
				.refine(val => val === '' || z.string().email().safeParse(val).success, {
					message: 'Correo electrónico no válido',
				}),
		})
		.optional(),

	resolution_approval: z.string().min(3, 'Mínimo 3 caracteres').max(255, 'Máximo 255 caracteres'),
	reason: z.string().min(3, 'Mínimo 3 caracteres').max(255, 'Máximo 255 caracteres'),
	topic: z.string().min(3, 'Mínimo 3 caracteres').max(2000, 'Máximo 2000 caracteres'),

	datePermanenceStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida (YYYY-MM-DD)'),
	datePermanenceEnd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida (YYYY-MM-DD)'),

	experiments: z
		.array(
			z.object({
				id: z.string(),
				amount: z.number().min(1, 'Debe ser al menos 1'),
			})
		)
		.min(1, 'Selecciona al menos un análisis.'),

	applicant: z.array(
		z.object({
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
		})
	),

	labs: z.array(z.string()).min(1, 'Selecciona al menos un laboratorio'),
	attached: z.string().min(3, 'Mínimo 3 caracteres').max(2000, 'Máximo 2000 caracteres'),
	grupe: z.string().min(3, 'Mínimo 3 caracteres').max(1000, 'Máximo 1000 caracteres'),
	observations: z.string().min(3, 'Mínimo 3 caracteres').max(2000, 'Máximo 2000 caracteres').optional(),
	clauses: z.string().min(3, 'Mínimo 3 caracteres').max(5000, 'Máximo 5000 caracteres').optional(),
})
