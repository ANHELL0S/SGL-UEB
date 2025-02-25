import { Op, Sequelize } from 'sequelize'
import { UserEntity } from '../../domain/entities/userEntity.js'
import {
	rol_Schema,
	user_Schema,
	user_roles_Schema,
	user_role_main_Schema,
	laboratory_analyst_Schema,
	access_lab_Scheme,
} from '../../../../schema/schemes.js'

export class UserRepository {
	static async findUserByField(field, value) {
		return await user_Schema.findOne({
			where: {
				[field]: value,
			},
		})
	}

	static async findUserByFieldExcept(field, value, id) {
		return await user_Schema.findOne({
			where: {
				[field]: value,
				id_user: {
					[Op.ne]: id,
				},
			},
		})
	}

	static async findAllUsers(offset, limit, search, id) {
		const whereCondition = search
			? Sequelize.literal(
					`concat("full_name", "identification_card", "email") ILIKE '%${search}%' AND id_user != '${id}'`
			  )
			: { id_user: { [Sequelize.Op.ne]: id } }

		const usersFound = await user_Schema.findAndCountAll({
			include: [
				{
					model: user_role_main_Schema,
					paranoid: false,
					include: [
						{
							model: user_roles_Schema,
							paranoid: false,
							include: [{ model: rol_Schema, paranoid: false }],
						},
					],
				},
			],
			paranoid: false,
			attributes: { exclude: ['password'] },
			where: whereCondition,
			limit,
			offset,
			distinct: true,
			order: [['updatedAt', 'DESC']],
		})

		return {
			count: usersFound.count,
			rows: usersFound.rows.map(user => new UserEntity(user)),
		}
	}

	static async findUserById(id) {
		const userFound = await user_Schema.findByPk(id, {
			include: [
				{
					model: user_role_main_Schema,
					include: [
						{
							model: user_roles_Schema,
							include: [{ model: rol_Schema }],
						},
					],
				},
			],
			paranoid: false,
		})

		return userFound ? new UserEntity(userFound) : null
	}

	static async createUser(data, transaction) {
		return await user_Schema.create(data, { transaction })
	}

	static async finduserRolesIntermediate(id) {
		return await user_role_main_Schema.findOne({ where: { id_user_fk: id } })
	}

	static async userRolesIntermediate(data, transaction) {
		return await user_role_main_Schema.create(data, { transaction })
	}

	static async assignRolesToUser(data, transaction) {
		const userRolesData = data.roles.map(roleId => ({
			id_user_role_intermediate_fk: data.userRolesIntermediate.dataValues.id_user_role_intermediate,
			id_rol_fk: roleId,
		}))

		return await user_roles_Schema.bulkCreate(userRolesData, { transaction })
	}

	static async deleteRolesToUser(id, transaction) {
		return await user_roles_Schema.destroy({
			where: {
				id_user_role_intermediate_fk: id,
			},
			transaction,
			paranoid: false,
			force: true,
		})
	}

	static async updateUser(id, data, transaction) {
		return await user_Schema.update(data, { where: { id_user: id }, transaction, paranoid: false })
	}

	static async updatePassword(id, hashedPassword, transaction) {
		return await user_Schema.update(
			{ password: hashedPassword },
			{
				where: { id_user: id },
				transaction,
			}
		)
	}

	static async deleteUser(id, transaction) {
		return await user_Schema.destroy({ where: { id_user: id }, transaction })
	}

	static async restoreUser(id, transaction) {
		return await user_Schema.restore({ where: { id_user: id }, transaction })
	}

	static async deletePermanentUser(id, transaction) {
		return await user_Schema.destroy({ where: { id_user: id }, transaction, paranoid: false, force: true })
	}

	static async findLaboratoryAnalyst(id) {
		return await laboratory_analyst_Schema.findOne({ where: { id_analyst_fk: id } })
	}

	static async findAccessLab(id) {
		return await access_lab_Scheme.findOne({ where: { id_access_manager_fk: id } })
	}
}
