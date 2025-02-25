import { Sequelize } from 'sequelize'
import { KardexEntity } from '../../domain/entities/kardexEntity.js'
import { ReactiveEntity } from '../../domain/entities/reactiveEntity.js'
import {
	consumptionReactive_Schema,
	experiments_category_Scheme,
	experiments_parameter_Scheme,
	kardex_Schema,
	reactive_Schema,
	unit_measurement_Schema,
	user_Schema,
} from '../../../../schema/schemes.js'
import { KARDEX } from '../../../../shared/constants/kardexValues-const.js'

export class KardexRepository {
	static async findAll(offset, limit, search, startUTC, endUTC, movementType, control_tracking, selectedUsers) {
		const whereCondition = {
			...(search && {
				[Sequelize.Op.or]: [
					{ notes: { [Sequelize.Op.iLike]: `%${String(search)}%` } },
					// TODO: PARA PODER BUSCAR POR UUID
					Sequelize.where(Sequelize.cast(Sequelize.col('id_reactive_fk'), 'TEXT'), {
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
			...(selectedUsers && { id_responsible: selectedUsers }),
			...(movementType && { action_type: movementType }),
		}

		const whereOptions = {}

		// Solo se agrega la condición si 'control_tracking' tiene un valor (no es nulo ni vacío)
		if (control_tracking) whereOptions.control_tracking = control_tracking

		const dataFound = await kardex_Schema.findAndCountAll({
			paranoid: false,
			include: [
				{
					model: reactive_Schema,
					paranoid: false,
					where: whereOptions,
					include: [
						{
							model: unit_measurement_Schema,
						},
					],
				},
				{ model: user_Schema, paranoid: false },
				{
					model: experiments_parameter_Scheme,
					paranoid: false,
					include: [
						{
							model: experiments_category_Scheme,
							paranoid: false,
						},
					],
				},
			],
			where: whereCondition,
			limit: limit || undefined,
			offset: offset || undefined,
			order: [['updatedAt', 'DESC']],
		})

		return {
			count: dataFound.count,
			rows: dataFound?.rows ? dataFound.rows.map(data => new KardexEntity(data)) : [],
		}
	}

	static async findAllPertainToUser(
		id_user,
		offset,
		limit,
		search,
		startUTC,
		endUTC,
		movementType,
		control_tracking,
		selectedUsers
	) {
		const whereCondition = {
			...(search && {
				[Sequelize.Op.or]: [{ notes: { [Sequelize.Op.iLike]: `%${String(search)}%` } }],
			}),
			...(startUTC &&
				endUTC && {
					createdAt: {
						[Sequelize.Op.gte]: startUTC,
						[Sequelize.Op.lte]: endUTC,
					},
				}),
			...(selectedUsers && { id_responsible: selectedUsers }),
			...(movementType && { action_type: movementType }),
			...(id_user && { id_responsible: id_user }),
			...{ action_type: KARDEX.RETURN },
			...{ isIndependent: true },
		}

		const whereOptions = {}

		// Solo se agrega la condición si 'control_tracking' tiene un valor (no es nulo ni vacío)
		if (control_tracking) whereOptions.control_tracking = control_tracking

		const dataFound = await kardex_Schema.findAndCountAll({
			paranoid: false,
			include: [
				{
					model: reactive_Schema,
					paranoid: false,
					where: whereOptions,
					include: [
						{
							model: unit_measurement_Schema,
						},
					],
				},
				{ model: user_Schema, paranoid: false },
				{ model: consumptionReactive_Schema, paranoid: false },
				{
					model: experiments_parameter_Scheme,
					paranoid: false,
					include: [
						{
							model: experiments_category_Scheme,
							paranoid: false,
						},
					],
				},
			],
			where: whereCondition,
			limit: limit || undefined,
			offset: offset || undefined,
			order: [['updatedAt', 'DESC']],
		})

		return {
			count: dataFound.count,
			rows: dataFound?.rows ? dataFound.rows.map(data => new KardexEntity(data)) : [],
		}
	}

	static async findReactiveById(id) {
		const dataFound = await reactive_Schema.findByPk(id, {
			paranoid: false,
			include: [
				{
					model: unit_measurement_Schema,
					paranoid: false,
				},
			],
		})
		return new ReactiveEntity(dataFound)
	}
}
