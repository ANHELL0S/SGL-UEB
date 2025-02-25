import { LabDTO } from '../../domain/dtos/labDTO.js'
import { LabRepository } from '../repository/labRepository.js'

export class LabService {
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
		const existingLab = await LabRepository.findLabById(data.lab)
		if (!existingLab) return { status: 404, error: 'Laboratorio no encontrado.' }

		await LabRepository.removeAssignAnalystLab(data.lab)

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
		await LabRepository.updateLab(id, { active: false }, transaction)
		return await LabRepository.deleteLab(id, transaction)
	}

	static async restoreLab(id, transaction) {
		await LabRepository.updateLab(id, { active: true }, transaction)
		return LabRepository.restoreLab(id, transaction)
	}

	static async deletePermanentLab(id, transaction) {
		return LabRepository.deletePermanentLab(id, transaction)
	}
}
