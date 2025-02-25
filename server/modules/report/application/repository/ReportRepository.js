import { Sequelize } from 'sequelize'
import { ReportEntity } from '../../domain/entities/ReportEntity.js'
import {
	user_Schema,
	sample_Schema,
	quotes_Scheme,
	access_Scheme,
	sample_report_Schema,
} from '../../../../schema/schemes.js'

export class ReportRepository {
	static async findAll(offset, limit, search, startUTC, endUTC, selectedSample, statusReport, selectedUsers) {
		const whereCondition = {
			...(search && {
				[Sequelize.Op.or]: [
					{ code: { [Sequelize.Op.iLike]: `%${search}%` } },
					{ '$seniorAnalyst.code$': { [Sequelize.Op.iLike]: `%${search}%` } },
					{ '$collaboratingAnalyst.code$': { [Sequelize.Op.iLike]: `%${search}%` } },
					{ '$sample.name$': { [Sequelize.Op.iLike]: `%${search}%` } },
				],
			}),
			...(startUTC &&
				endUTC && {
					createdAt: {
						[Sequelize.Op.gte]: startUTC,
						[Sequelize.Op.lte]: endUTC,
					},
				}),
			...(selectedSample && { id_sample_fk: selectedSample }),
			...(selectedUsers && { senior_analyst: selectedUsers }),
			...(statusReport && { isIssued: statusReport }),
		}

		const dataFound = await sample_report_Schema.findAndCountAll({
			paranoid: false,
			include: [
				{
					model: user_Schema,
					as: 'seniorAnalyst',
					paranoid: false,
				},
				{
					model: user_Schema,
					as: 'collaboratingAnalyst',
					paranoid: false,
				},
				{
					model: sample_Schema,
					as: 'sample',
					paranoid: false,
					include: [
						{
							model: quotes_Scheme,
							paranoid: false,
							include: [
								{
									model: access_Scheme,
									paranoid: false,
								},
							],
						},
					],
				},
			],
			where: whereCondition,
			limit: limit || undefined,
			offset: offset || undefined,
			distinct: true,
			order: [['updatedAt', 'DESC']],
		})

		return {
			count: dataFound.count,
			rows: dataFound.rows.map(data => new ReportEntity(data)),
		}
	}

	static async getAllToSample(id) {
		const dataFound = await sample_report_Schema.findAndCountAll({
			distinct: true,
			paranoid: false,
			where: { id_quote_fk: id },
			order: [['updatedAt', 'DESC']],
			include: [
				{
					model: user_Schema,
					as: 'seniorAnalyst',
					paranoid: false,
				},
				{
					model: user_Schema,
					as: 'collaboratingAnalyst',
					paranoid: false,
				},
				{
					model: sample_Schema,
					as: 'sample',
					paranoid: false,
					include: [
						{
							model: quotes_Scheme,
							paranoid: false,
							include: [
								{
									model: access_Scheme,
									paranoid: false,
								},
							],
						},
					],
				},
			],
		})

		return {
			count: dataFound.count,
			rows: dataFound.rows.map(data => new ReportEntity(data)),
		}
	}

	static async findReportById(id, transaction) {
		return await sample_report_Schema.findByPk(id, {
			transaction,
			paranoid: false,
		})
	}

	static async updateReport(id, data, transaction) {
		return await sample_report_Schema.update(data, {
			where: { id_report: id },
			transaction,
			force: true,
			paranoid: false,
		})
	}

	static async delete(id, transaction) {
		return sample_report_Schema.destroy({ where: { id_report: id }, transaction, force: true, paranoid: false })
	}
}
