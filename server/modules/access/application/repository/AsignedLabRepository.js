import { AsignedLabEntity } from '../../domain/entities/AsignedLabEntity.js'
import {
	laboratory_Schema,
	laboratory_analyst_Schema,
	user_Schema,
	access_lab_Scheme,
} from '../../../../schema/schemes.js'

export class AsignedLabRepository {
	static async findAll(id) {
		const dataFound = await access_lab_Scheme.findAndCountAll({
			where: { id_access_fk: id },
			include: [
				{
					model: laboratory_Schema,
					paranoid: false,
					include: [
						{
							model: laboratory_analyst_Schema,
							paranoid: false,
							include: [
								{
									model: user_Schema,
									paranoid: false,
								},
							],
						},
					],
				},
			],
			paranoid: false,
			order: [['createdAt', 'DESC']],
		})

		return {
			count: dataFound.count,
			rows: (dataFound || []).rows.map(data => new AsignedLabEntity(data)),
		}
	}

	static async findById(id) {
		const dataFound = await access_lab_Scheme.findByPk(id, { paranoid: false })
		return dataFound ? new AsignedLabEntity(dataFound) : null
	}

	static async create(data, transaction) {
		const recordsToInsert = data.labs.map(labObj => ({
			id_access_fk: data.id_access_fk,
			id_lab_fk: labObj.id_lab_fk,
		}))

		return await access_lab_Scheme.bulkCreate(recordsToInsert, { transaction })
	}

	static async deletePermanent(id, transaction) {
		return await access_lab_Scheme.destroy({
			where: {
				id_access_fk: id,
			},
			force: true,
			transaction,
			paranoid: false,
		})
	}
}
