import moment from 'moment'
import { ReactiveDTO } from '../../domain/dtos/reactiveDTO.js'
import { ReactiveRepository } from '../repository/reactiveRepository.js'
import { KARDEX } from '../../../../shared/constants/kardexValues-const.js'
import { z } from 'zod'

export class ReactiveService {
	static async getAll(page, limit, search) {
		const offset = limit ? (page - 1) * limit : null
		const result = await ReactiveRepository.findAll(offset, limit, search)

		return {
			totalRecords: result.count,
			totalPages: limit ? Math.ceil(result.count / limit) : 1,
			currentPage: limit ? parseInt(page, 10) : 1,
			recordsPerPage: limit ? parseInt(limit, 10) : result.count,
			reactives: result.rows.map(reactive => ReactiveDTO.toResponse(reactive)),
		}
	}

	static async getById(id) {
		const dataFound = await ReactiveRepository.findById(id)
		return dataFound ? ReactiveDTO.toResponse(dataFound) : null
	}

	static async uploadedFile(data, user, transaction) {
		// Esquema para números decimales (acepta tanto números como strings numéricos)
		const safeDecimal = z.preprocess(
			arg => {
				if (typeof arg === 'number') return arg
				if (typeof arg === 'string') return Number(arg)
				return NaN
			},
			z
				.number({ invalid_type_error: 'No es un número' })
				.refine(val => !Number.isNaN(val), { message: 'No es un número' })
		)

		// Esquema para números enteros
		const safeInteger = z.preprocess(
			arg => {
				if (typeof arg === 'number') return arg
				if (typeof arg === 'string') return Number(arg)
				return NaN
			},
			z
				.number({ invalid_type_error: 'No es un número' })
				.refine(val => !Number.isNaN(val), { message: 'No es un número' })
				.refine(val => Number.isInteger(val), { message: 'Número de envases debe ser un entero' })
		)

		const casValidator = z.preprocess(value => {
			if (value === undefined || value === null) return undefined
			return String(value)
		}, z.string().optional())

		// Esquema de validación con Zod para cada reactivo
		const reactiveSchema = z.object({
			name: z.string({ required_error: 'Reactivo es requerido' }).max(255, 'Reactivo debe tener máximo 255 caracteres'),
			code: z.string({ required_error: 'Código es requerido' }).max(255, 'Código debe tener máximo 255 caracteres'),
			number_of_containers: safeInteger,
			current_quantity: safeDecimal,
			unit: z.string({ required_error: 'Unidad es requerida' }).max(255, 'Unidad debe tener máximo 255 caracteres'),
			// 'cas' es opcional
			cas: casValidator,
			// control_tracking debe ser "si" o "no" (sin importar mayúsculas/minúsculas)
			control_tracking: z
				.string({ required_error: 'Fiscalización es requerida' })
				.refine(val => ['si', 'no'].includes(val.toLowerCase()), {
					message: "Fiscalización debe ser 'si' o 'no'",
				}),
			// expiration_date puede ser una cadena en formato MM/DD/YYYY o null
			expiration_date: z.union([
				z.string().regex(/^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/, {
					message: 'Fecha de vencimiento debe ser en formato MM/DD/YYYY',
				}),
				z.null(),
			]),
		})

		// Función para transformar los datos del Excel
		const transformData = data => {
			return data.map(item => ({
				name: item['Reactivo'],
				code: item['Código'],
				number_of_containers: item['Número de envases'],
				current_quantity: item['Cantidad'], // Puede venir como string o número
				unit: item['Unidad'],
				cas: item['CAS'],
				control_tracking: item['Fiscalización'],
				expiration_date: item['Fecha de vencimiento']
					? moment('1899-12-30').add(item['Fecha de vencimiento'], 'days').format('MM/DD/YYYY')
					: null,
			}))
		}

		const transformedData = transformData(data)

		// Validamos cada registro utilizando el schema de Zod y generamos mensaje de error con referencia
		for (let index = 0; index < transformedData.length; index++) {
			const result = reactiveSchema.safeParse(transformedData[index])
			if (!result.success) {
				const errors = result.error.errors.map(err => err.message).join(', ')
				return {
					status: 400,
					error: `Fila ${index + 2}, ${transformedData[index].name || 'reactivo'} - ${errors}.`,
				}
			}
		}

		// Validación de la existencia de la unidad de medida en la base de datos
		const unitTransformData = await ReactiveRepository.findAllUnitMeasurement()
		const unmatchedUnits = transformedData.filter(
			item =>
				!unitTransformData.rows.some(unitData => unitData.unit.trim().toLowerCase() === item.unit.trim().toLowerCase())
		)

		if (unmatchedUnits.length > 0) {
			// Para cada unidad no encontrada se obtiene la referencia de la fila y el nombre
			const unmatchedErrors = unmatchedUnits
				.map(item => {
					const idx = transformedData.indexOf(item)
					return `Fila ${idx + 2}, ${item.name} - Unidad de medida no válida: ${item.unit}`
				})
				.join('; ')
			return {
				status: 404,
				error: unmatchedErrors,
			}
		}

		// Asignar IDs de unidad de medida a cada registro validado
		const validatedData = transformedData.map(item => {
			const matchedUnit = unitTransformData.rows.find(
				unitData => unitData.unit.trim().toLowerCase() === item.unit.trim().toLowerCase()
			)
			return {
				...item,
				id_unit_measurement_fk: matchedUnit.id_unit_measurement,
			}
		})

		// Validación de duplicados (ya existe reactivo con el mismo nombre o código)
		for (let index = 0; index < validatedData.length; index++) {
			const item = validatedData[index]
			const existingRecord =
				(await ReactiveRepository.findByField('name', item.name)) ||
				(await ReactiveRepository.findByField('code', item.code))

			if (existingRecord) {
				return {
					status: 409,
					error: `Fila ${index + 2}, ${item.name} - Ya existe un reactivo con el mismo nombre, código o CAS.`,
				}
			}
		}

		// Creación de los reactivos
		const createdReactives = await ReactiveRepository.create(validatedData, transaction)

		// Registro en el kardex para cada reactivo creado
		const kardexEntries = createdReactives.map(reactive => ({
			id_reactive_fk: reactive.id_reactive,
			action_type: KARDEX.ENTRY,
			id_responsible: user,
			quantity: reactive.current_quantity,
			balance_after_action: reactive.current_quantity,
			notes: `Ingreso inicial del reactivo ${reactive.name}.`,
		}))

		await ReactiveRepository.createMoreKardex(kardexEntries, transaction)

		return {
			status: 201,
			message: `Se han registrado ${createdReactives.length} reactivos y su ingreso en el kardex.`,
		}
	}

	static async findByField(field, value) {
		return await reactive_Schema.findOne({
			paranoid: false,
			where: { [field]: value },
		})
	}

	static async create(data, user, transaction) {
		const existingName = await ReactiveRepository.findByField('name', data.name)
		if (existingName) return { code: 400, error: 'El nombre ya está en uso.' }

		const existingCode = await ReactiveRepository.findByField('code', data.code)
		if (existingCode) return { code: 400, error: 'El código ya está en uso.' }

		const dataTransform = ReactiveDTO.toCreate({ ...data })
		const newData = await ReactiveRepository.createOneReactive(dataTransform, transaction)

		const dataKardex = {
			id_reactive_fk: newData.id_reactive,
			action_type: KARDEX.ENTRY,
			id_responsible: user,
			quantity: newData.current_quantity,
			balance_after_action: newData.current_quantity,
			notes: `Ingreso inicial del reactivo ${newData.name}.`,
		}

		await ReactiveRepository.createKardex(dataKardex, transaction)

		return { reactive: newData }
	}

	static async update(id, data, user, transaction) {
		// Verificar unicidad del nombre
		const existingName = await ReactiveRepository.findByFieldExcept('name', data.name, id)
		if (existingName) return { code: 400, error: 'El nombre ya está en uso.' }

		// Verificar unicidad del código
		const existingCode = await ReactiveRepository.findByFieldExcept('code', data.code, id)
		if (existingCode) return { code: 400, error: 'El código ya está en uso.' }

		// Obtener los datos actuales del reactivo
		const currentReactive = await ReactiveRepository.findById(id)
		if (!currentReactive) return { code: 404, error: 'Reactivo no encontrado.' }

		const oldQuantity = currentReactive.current_quantity
		const newQuantity = data.current_quantity

		// Actualizar el reactivo siempre
		const uptData = ReactiveDTO.toUpdate({ ...data })
		const updatedReactive = await ReactiveRepository.update(id, uptData, transaction)

		// Si hay cambio en la cantidad, registrar la operación en el kardex
		if (Math.abs(newQuantity - oldQuantity) > 0) {
			let actionType = null
			let notes = 'Actualización'

			if (newQuantity > oldQuantity) {
				actionType = KARDEX.ENTRY
				notes += `: Se incrementó de ${oldQuantity} a ${newQuantity}`
			} else if (newQuantity < oldQuantity) {
				actionType = KARDEX.ADJUSTMENT
				notes += `: Se redujo de ${oldQuantity} a ${newQuantity}`
			}

			await ReactiveRepository.createKardex(
				{
					id_reactive_fk: id,
					action_type: actionType,
					id_responsible: user,
					quantity: Math.abs(newQuantity - oldQuantity),
					balance_after_action: newQuantity,
					notes,
				},
				transaction
			)
		}

		return updatedReactive
	}

	static async changeStatus(id, data, transaction) {
		if (data.hasOwnProperty('status')) data.status = !data.status

		const userData = ReactiveDTO.toChangeStatus({ ...data })
		const updatedUser = await ReactiveRepository.update(id, userData, transaction)

		return { lab: updatedUser }
	}

	static async delete(id, transaction) {
		return await ReactiveRepository.delete(id, transaction)
	}

	static async restore(id, transaction) {
		return await ReactiveRepository.restore(id, transaction)
	}

	static async deletePermanent(id, transaction) {
		return await ReactiveRepository.deletePermanent(id, transaction)
	}
}
