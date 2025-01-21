import { LabDTO } from '../../domain/dtos/labDTO.js'
import { LabRepository } from '../repository/labRepository.js'

export class LabService {
	/*
	static async getAllLabs(page, limit, search) {
		const offset = (page - 1) * limit
		const result = await LabRepository.findAllLabs(offset, limit, search)
		return {
			totalRecords: result.count,
			totalPages: Math.ceil(result.count / limit),
			currentPage: parseInt(page, 10),
			recordsPerPage: parseInt(limit, 10),
			labs: result.rows.map(lab => LabDTO.toResponse(lab)),
		}
	}
	*/

	static async getAllLabs(page, limit, search) {
		const offset = limit ? (page - 1) * limit : null
		const result = await LabRepository.findAllLabs(offset, limit, search)

		return {
			totalRecords: result.count,
			totalPages: limit ? Math.ceil(result.count / limit) : 1,
			currentPage: limit ? parseInt(page, 10) : 1,
			recordsPerPage: limit ? parseInt(limit, 10) : result.count,
			labs: result.rows.map(lab => LabDTO.toResponse(lab)),
		}
	}

	static async getLabById(id) {
		const dataFound = await LabRepository.findLabById(id)
		return dataFound ? LabDTO.toResponse(dataFound) : null
	}

	static async findToName(name) {
		const dataFound = await LabRepository.findToName(name)
		return dataFound ? LabDTO.toResponse(dataFound) : null
	}

	static async createLab(data, transaction) {
		const existingName = await LabRepository.findLabByField('name', data.name)
		if (existingName) return { error: 'El nombre ya está en uso.' }

		const existingDescription = await LabRepository.findLabByField('description', data.description)
		if (existingDescription) return { error: 'La descripción ya está en uso.' }

		const labData = LabDTO.transformData({ ...data })
		const createdUser = await LabRepository.createLab(labData, transaction)

		return { lab: createdUser }
	}

	static async updateLab(id, data, transaction) {
		const existingName = await LabRepository.findLabByFieldExcept('name', data.name, id)
		if (existingName) return { error: 'El nombre ya está en uso.' }

		const existingDescription = await LabRepository.findLabByFieldExcept('description', data.description, id)
		if (existingDescription) return { error: 'La descripción ya está en uso.' }

		const labData = LabDTO.transformData({ ...data })
		const updatedLab = await LabRepository.updateLab(id, labData, transaction)

		return { lab: updatedLab }
	}

	static async assignAnalystLab(data, transaction) {
		const existingLab = await LabRepository.findLabById(data.id_lab)
		if (!existingLab) return { status: 404, error: 'Laboratorio no encontrado.' }

		await LabRepository.removeAssignAnalystLab(data.id_lab)

		const labData = LabDTO.assignAnalystLab({ ...data })
		const assignAnalyst = await LabRepository.assignAnalystLab(labData, transaction)

		return { status: 200, lab: assignAnalyst }
	}

	static async removeAssignAnalystLab(id, transaction) {
		const existingAnalystLab = await LabRepository.findLaboratoryAnalyst(id)
		if (!existingAnalystLab) return { status: 404, error: 'Analista responsable no encontrado.' }

		await LabRepository.removeAssignAnalystLab(id, transaction)

		return true
	}

	static async changeStatusLab(id, data, transaction) {
		if (data.hasOwnProperty('active')) data.active = !data.active

		const userData = LabDTO.transformData({ ...data })
		const updatedUser = await LabRepository.updateLab(id, userData, transaction)

		return { lab: updatedUser }
	}

	static async deleteLab(id, transaction) {
		const labFound = await LabRepository.findLabById(id)
		const associatedAccessLab = await LabRepository.findAccessLab(labFound.id_lab)
		if (associatedAccessLab) return { error: 'Accesos asociados al laboratorio.' }
		const associatedAnalysts = await LabRepository.findLaboratoryAnalyst(id)
		if (associatedAnalysts) return { error: 'Analista responsable del laboratorio.' }

		return LabRepository.deleteLab(id, transaction)
	}
}
