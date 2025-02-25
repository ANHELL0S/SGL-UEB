import moment from 'moment'

export class KardexDTO {
	static toResponse(data) {
		return {
			id_kardex: data?.id_kardex,
			user: data?.user,
			reactive: data?.reactive,
			analysis: data?.analysis,
			action_type: data?.action_type,
			quantity: data?.quantity,
			balance_after_action: data?.balance_after_action,
			notes: data?.notes,
			consumption: data?.consumption,
			createdAt: data?.createdAt,
			updatedAt: data?.updatedAt,
			deletedAt: data?.deletedAt,
		}
	}

	static toCreate(data) {
		return {
			code: data?.code,
			name: data?.name,
			number_of_containers: data?.number_of_containers,
			current_quantity: data?.current_quantity,
			id_unit_measurement_fk: data?.unit,
			cas: data?.cas || null,
			expiration_date: data?.expiration_date ? moment(data?.expiration_date).format('YYYY-MM-DD HH:mm:ssZ') : null,
		}
	}

	static toUpdate(data) {
		return {
			code: data?.code,
			name: data?.name,
			number_of_containers: data?.number_of_containers,
			current_quantity: data?.current_quantity,
			id_unit_measurement_fk: data?.unit,
			cas: data?.cas || null,
			expiration_date: data?.expiration_date ? moment(data?.expiration_date).format('YYYY-MM-DD HH:mm:ssZ') : null,
		}
	}
}
