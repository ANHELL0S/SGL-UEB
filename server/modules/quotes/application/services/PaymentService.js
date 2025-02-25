import { PaymentRepository } from '../repository/PaymentRepository.js'
import { PaymentDTO } from '../../domain/dtos/PaymentDTO.js'

export class PaymentService {
	static async getById(id) {
		const dataFound = await PaymentRepository.findById(id)
		return dataFound ? PaymentDTO.toResponse(dataFound) : null
	}

	static async create(id, data, transaction) {
		const formattedData = PaymentDTO.toCreate({
			id,
			...data,
		})
		return await PaymentRepository.create(formattedData, transaction)
	}

	static async update(id, data, transaction) {
		const formattedData = PaymentDTO.toUpdate({
			id,
			...data,
		})
		return await PaymentRepository.update(id, formattedData, transaction)
	}
}
