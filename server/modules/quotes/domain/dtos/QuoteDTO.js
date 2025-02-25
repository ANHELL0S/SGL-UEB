import { QUOTE } from '../../../../shared/constants/payment-const.js'

export class QuoteDTO {
	static toResponse(data) {
		let statusInSpanish
		switch (data.status) {
			case QUOTE.PENDING:
				statusInSpanish = QUOTE.PENDING_ES
				break
			case QUOTE.APPROVED:
				statusInSpanish = QUOTE.APPROVED_ES
				break
			case QUOTE.REJECTD:
				statusInSpanish = QUOTE.REJECTED_ES
				break
			default:
				statusInSpanish = data.status
				break
		}

		return {
			id_quote: data.id_quote,
			code: data.code,
			bill: data.bill,
			pdf: data.pdf,
			type_quote: data.type_quote,
			type_sample: data.type_sample,
			amount_sample: data.amount_sample,
			detail_sample: data.detail_sample,
			name: data.name,
			email: data.email,
			direction: data.direction,
			dni: data.dni,
			phone: data.phone,
			status: statusInSpanish,
			experiments: data.experiments,
			labs: data.labs,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
			deletedAt: data.deletedAt,
		}
	}

	static toCreate(data) {
		return {
			type_quote: 'external',
			type_sample: data.type_sample,
			amount_sample: parseInt(data.amount_sample),
			detail_sample: data.detail_sample,
			experiments: data.experiments.map(experiment => ({
				id_experiment: experiment.id, // Ahora accede al id del objeto
				amount: experiment.amount, // Agrega la cantidad del experimento
			})),
			name: data.name,
			email: data.email,
			dni: data.dni,
			phone: data.phone,
			direction: data.direction,
			code: data.code,
		}
	}

	static toUpdate(data) {
		return {
			id_quote: data.id_quote,
			type_quote: data.type_quote,
			name: data.name,
			email: data.email,
			direction: data.direction,
			dni: data.dni,
			phone: data.phone,
			status: data.status,
			experiments: data.experiments,
			code: data.code,
			bill: data.bill,
			updatedAt: data.updatedAt,
			createdAt: data.createdAt,
			deletedAt: data.deletedAt,
		}
	}
}
