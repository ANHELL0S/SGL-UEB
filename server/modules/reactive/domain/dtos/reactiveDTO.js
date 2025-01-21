import moment from 'moment'

export class ReactiveDTO {
	static toResponse(data) {
		return {
			id_reactive: data.id_reactive,
			status: data.status,
			code: data.code,
			name: data.name,
			unit: data.units_measurement.unit,
			number_of_containers: data.number_of_containers,
			initial_quantity: data.initial_quantity,
			current_quantity: data.current_quantity,
			cas: data.cas,
			expiration_date: data.expiration_date,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
		}
	}

	static toChangeStatus(data) {
		return {
			status: data.status,
		}
	}

	static toCreate(data) {
		return {
			code: data.code,
			name: data.name,
			number_of_containers: data.number_of_containers,
			initial_quantity: data.initial_quantity,
			current_quantity: data.current_quantity,
			id_unit_measurement_fk: data.unit,
			cas: data.cas || null,
			expiration_date: data.expiration_date ? moment(data.expiration_date).format('YYYY-MM-DD HH:mm:ssZ') : null,
			quantity_consumed: data.quantity_consumed,
			is_controlled: data.is_controlled,
		}
	}
}
