import { PaymentEntity } from '../../domain/entities/PaymentEntity.js'
import { quotes_payments_Scheme } from '../../../../schema/schemes.js'

export class PaymentRepository {
	static async findById(id) {
		const dataFound = await quotes_payments_Scheme.findOne({
			where: { id_quote_fk: id },
		})
		return dataFound ? new PaymentEntity(dataFound) : null
	}

	static async create(data, transaction) {
		return await quotes_payments_Scheme.create(data, { transaction })
	}

	static async update(id, data, transaction) {
		return await quotes_payments_Scheme.update(data, {
			where: { id_quote_payment: id },
			transaction,
		})
	}

	static async delete(id, transaction) {
		return await quotes_payments_Scheme.destroy({ where: { id_quote_fk: id }, transaction })
	}
}
