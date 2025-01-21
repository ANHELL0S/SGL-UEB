import moment from 'moment'
import { ReactiveDTO } from '../../domain/dtos/reactiveDTO.js'
import { ReactiveRepository } from '../repository/reactiveRepository.js'

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

	static async findToName(name) {
		const dataFound = await ReactiveRepository.findToName(name)
		return dataFound ? ReactiveDTO.toResponse(dataFound) : null
	}

	static async uploadedFile(data, transaction) {
		const transformData = data => {
			return data.map(item => ({
				name: item['Reactivo'],
				code: item['Código'],
				number_of_containers: item['Número de envases'],
				initial_quantity: item['Cantidad Inicial'],
				current_quantity: item['Cantidad actual'],
				unit: item['Unidad'],
				cas: item['CAS'],
				expiration_date: item['Fecha de vencimiento']
					? moment('1899-12-30').add(item['Fecha de vencimiento'], 'days').toDate()
					: '',
				quantity_consumed: item['Cantidad consuimida'],
				is_controlled: item['Control'] === 'Sí',
			}))
		}

		const transformedData = transformData(data)

		const unitTransformData = await ReactiveRepository.findAllUnitMeasurement()

		// Validación de unidades de medida
		const unmatchedUnits = transformedData.filter(
			item =>
				!unitTransformData.rows.some(unitData => unitData.unit.trim().toLowerCase() === item.unit.trim().toLowerCase())
		)

		// Si alguna unidad no coincide, se devuelve el error
		if (unmatchedUnits.length > 0) {
			return {
				status: 404,
				error: `${unmatchedUnits.map(u => u.unit).join(', ')}. Unidad de medida no válida.`,
			}
		}

		const validatedData = transformedData.map(item => {
			const matchedUnit = unitTransformData.rows.find(
				unitData => unitData.unit.toLowerCase() === item.unit.toLowerCase()
			)
			return {
				...item,
				id_unit_measurement_fk: matchedUnit.id_unit_measurement,
			}
		})

		const requiredFields = {
			name: 'Reactivo',
			code: 'Código',
			number_of_containers: 'Número de envases',
			initial_quantity: 'Cantidad Inicial',
			current_quantity: 'Cantidad actual',
			unit: 'Unidad',
			//cas: 'CAS',
			expiration_date: 'Fecha de vencimiento',
			quantity_consumed: 'Cantidad consumida',
			is_controlled: 'Control',
		}

		// Recorremos las filas
		for (let index = 0; index < validatedData.length; index++) {
			const item = validatedData[index]

			// Find missing fields
			const missingFields = Object.keys(requiredFields).filter(
				field => item[field] === undefined || item[field] === '' || item[field] === null
			)

			// Si hay campos vacíos, devolvemos el error de esa fila
			if (missingFields.length > 0) {
				const reactivoName = item.name || 'reactivo'
				const missingFieldNames = missingFields.map(field => requiredFields[field]) // Map the field keys to the labels
				return {
					status: 400,
					error: `Fila ${index + 3}, ${reactivoName} - Faltan los siguientes campos: ${missingFieldNames.join(', ')}.`,
				}
			}
		}

		return await ReactiveRepository.create(validatedData, transaction)
	}

	static async create(data, transaction) {
		const existingName = await ReactiveRepository.findByField('name', data.name)
		if (existingName) return { error: 'El nombre ya está en uso.' }

		const existingCode = await ReactiveRepository.findByField('code', data.code)
		if (existingCode) return { error: 'El código ya está en uso.' }

		const dataTransform = ReactiveDTO.toCreate({ ...data })
		const newData = await ReactiveRepository.create(dataTransform, transaction)

		return { reactive: newData }
	}

	static async updateLab(id, data, transaction) {
		const existingName = await ReactiveRepository.findLabByFieldExcept('name', data.name, id)
		if (existingName) return { error: 'El nombre ya está en uso.' }

		const existingDescription = await ReactiveRepository.findLabByFieldExcept('description', data.description, id)
		if (existingDescription) return { error: 'La descripción ya está en uso.' }

		const labData = ReactiveDTO.transformData({ ...data })
		const updatedLab = await ReactiveRepository.updateLab(id, labData, transaction)

		return { lab: updatedLab }
	}

	static async assignAnalystLab(data, transaction) {
		const existingLab = await ReactiveRepository.findLabById(data.id_lab)
		if (!existingLab) return { status: 404, error: 'Laboratorio no encontrado.' }

		await ReactiveRepository.removeAssignAnalystLab(data.id_lab)

		const labData = ReactiveDTO.assignAnalystLab({ ...data })
		const assignAnalyst = await ReactiveRepository.assignAnalystLab(labData, transaction)

		return { status: 200, lab: assignAnalyst }
	}

	static async removeAssignAnalystLab(id, transaction) {
		const existingAnalystLab = await ReactiveRepository.findLaboratoryAnalyst(id)
		if (!existingAnalystLab) return { status: 404, error: 'Analista responsable no encontrado.' }

		await ReactiveRepository.removeAssignAnalystLab(id, transaction)

		return true
	}

	static async changeStatus(id, data, transaction) {
		if (data.hasOwnProperty('status')) data.status = !data.status

		const userData = ReactiveDTO.toChangeStatus({ ...data })
		const updatedUser = await ReactiveRepository.update(id, userData, transaction)

		return { lab: updatedUser }
	}

	static async deleteLab(id, transaction) {
		const labFound = await ReactiveRepository.findLabById(id)
		const associatedAccessLab = await ReactiveRepository.findAccessLab(labFound.id_lab)
		if (associatedAccessLab) return { error: 'Accesos asociados al laboratorio.' }
		const associatedAnalysts = await ReactiveRepository.findLaboratoryAnalyst(id)
		if (associatedAnalysts) return { error: 'Analista responsable del laboratorio.' }

		return ReactiveRepository.deleteLab(id, transaction)
	}
}
