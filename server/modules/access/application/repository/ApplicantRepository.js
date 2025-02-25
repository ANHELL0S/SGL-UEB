import { access_applicant_Scheme } from '../../../../schema/schemes.js'

export class ApplicantRepository {
	static async create(data, transaction) {
		return await access_applicant_Scheme.create(data, { transaction })
	}

	static async update(id, data, transaction) {
		return await access_applicant_Scheme.update(data, {
			where: { id_access_applicant: id },
			transaction,
			paranoid: false,
		})
	}

	static async delete(id, transaction) {
		return await access_applicant_Scheme.destroy({
			where: { id_access_applicant: id },
			transaction,
			paranoid: false,
			force: true,
		})
	}
}
