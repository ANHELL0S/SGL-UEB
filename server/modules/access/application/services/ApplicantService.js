import { access_applicant_Scheme, access_Scheme } from '../../../../schema/schemes.js'
import { ApplicantDTO } from '../../domain/dtos/ApplicantDTO.js'
import { ApplicantRepository } from '../repository/ApplicantRepository.js'

export class ApplicantService {
	static async getById(id) {
		const dataFound = await ApplicantRepository.findAccessLabById(id)
		return dataFound ? ApplicantDTO.toResponse(dataFound) : null
	}

	static async create(data, transaction) {
		const dataFormater = ApplicantDTO.toCreate(data)

		const findAccess = await access_Scheme.findByPk(dataFormater.id_access_fk)
		if (!findAccess) return { code: 400, error: 'Acceso no encontrado.' }

		return await ApplicantRepository.create(dataFormater, transaction)
	}

	static async update(id, data, transaction) {
		const dataFormater = ApplicantDTO.toUpdate(data)

		const findApplicant = await access_applicant_Scheme.findByPk(id)
		if (!findApplicant) return { code: 400, error: 'Aplicante no encontrado.' }

		return await ApplicantRepository.update(id, dataFormater, transaction)
	}

	static async delete(id, transaction) {
		const findApplicant = await access_applicant_Scheme.findByPk(id)
		if (!findApplicant) return { code: 400, error: 'Aplicante no encontrado.' }

		return await ApplicantRepository.delete(id, transaction)
	}
}
