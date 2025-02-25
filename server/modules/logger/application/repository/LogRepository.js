import { Sequelize } from 'sequelize'
import { LogEntity } from '../../domain/entities/logEntity.js'
import { logs_Schema, user_Schema } from '../../../../schema/schemes.js'

export class LogRepository {
	static async findAll(offset, limit, search, startUTC, endUTC, level, action, message) {
		const whereCondition = {
			...(search && {
				[Sequelize.Op.or]: [
					{ action: { [Sequelize.Op.iLike]: `%${String(search)}%` } },
					// TODO: PARA PODER BUSCAR POR UUID
					Sequelize.where(Sequelize.cast(Sequelize.col('user_fk'), 'TEXT'), {
						[Sequelize.Op.iLike]: `%${String(search)}%`,
					}),
				],
			}),
			...(startUTC &&
				endUTC && {
					createdAt: {
						[Sequelize.Op.gte]: startUTC,
						[Sequelize.Op.lte]: endUTC,
					},
				}),
			...(message && { message: message }),
			...(level && { level: level }),
		}

		const dataFound = await logs_Schema.findAndCountAll({
			paranoid: false,
			include: [
				{
					model: user_Schema,
					paranoid: false,
				},
			],
			where: whereCondition,
			limit: limit || undefined,
			offset: offset || undefined,
			order: [['createdAt', 'DESC']],
		})

		return {
			count: dataFound.count,
			rows: dataFound?.rows ? dataFound.rows.map(data => new LogEntity(data)) : [],
		}
	}
}
