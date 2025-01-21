import { z } from 'zod'
import { isValidCI } from '../../../shared/validators/cli-validator.js'
import { STATUS_ACCESS, TYPE_ACCESS } from '../../../shared/constants/access-const.js'

export const params_schema_zod = z.object({
	id: z.string().uuid({ message: 'ID no válida.' }),
})

export const accessLab_schema_zod = z
	.object({
		type_access: z.string().refine(value => value === TYPE_ACCESS.INTERNAL || value === TYPE_ACCESS.PUBLIC, {
			message: 'Escoge el tipo de acceso',
		}),

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

		reason: z.string().min(3, 'Mínimo 3 caracteres').max(255, 'Máximo 255 caracteres'),

		observations: z.string().min(3, 'Mínimo 3 caracteres').max(2000, 'Máximo 2000 caracteres').optional(),

		topic: z.string().min(3, 'Mínimo 3 caracteres').max(2000, 'Máximo 2000 caracteres'),

		startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/, 'Hora invalida (HH:MM)'),

		endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/, 'Hora invalida (HH:MM)'),

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

		analysis_required: z.string().min(3, 'Mínimo 3 caracteres').max(2000, 'Máximo 2000 caracteres'),
	})
	.superRefine((data, ctx) => {
		// Si type_access es "access_external", los campos "faculty", "career", y "director" deben ser opcionales
		if (data.type_access === 'access_external') {
			// Comprobar si los campos opcionales no tienen valores vacíos
			if (data.faculty && data.faculty !== '') {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Los campos facultad, carrera y director no deben estar presentes para acceso externo.',
					path: ['faculty'],
				})
			}
			if (data.career && data.career !== '') {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Los campos facultad, carrera y director no deben estar presentes para acceso externo.',
					path: ['career'],
				})
			}
			if (data.director && (data.director.name || data.director.dni || data.director.email)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Los campos facultad, carrera y director no deben estar presentes para acceso externo.',
					path: ['director'],
				})
			}
		}

		// Si type_access es "access_internal", los campos "faculty", "career", y "director" son obligatorios
		else if (data.type_access === 'access_internal') {
			if (!data.faculty || data.faculty === '') {
				ctx.addIssue({
					path: ['faculty'],
					code: z.ZodIssueCode.invalid_type,
					message: 'El campo facultad es obligatorio para acceso interno.',
				})
			}
			if (!data.career || data.career === '') {
				ctx.addIssue({
					path: ['career'],
					code: z.ZodIssueCode.invalid_type,
					message: 'El campo carrera es obligatorio para acceso interno.',
				})
			}
			if (!data.director || !data.director.name || !data.director.dni || !data.director.email) {
				ctx.addIssue({
					path: ['director'],
					code: z.ZodIssueCode.invalid_type,
					message: 'El campo director es obligatorio para acceso interno.',
				})
			}
		}
	})

export const accessLab_status_schema_zod = z.object({
	status: z
		.string()
		.refine(value => value === STATUS_ACCESS.APPROVED || value === STATUS_ACCESS.APPROVED || STATUS_ACCESS.REJECTED, {
			message: 'Escoge el tipo de acceso',
		}),
})
