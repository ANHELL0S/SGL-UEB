import moment from 'moment'

export class ReactiveDTO {
	static toResponse(data) {
		return {
			id_reactive: data.id_reactive,
			status: data.status,
			code: data.code,
			name: data.name,
			unit: data.unit,
			number_of_containers: data.number_of_containers,
			current_quantity: parseFloat(data.current_quantity).toFixed(5),
			cas: data.cas,
			control_tracking: data.control_tracking,
			expiration_date: data.expiration_date,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
			deletedAt: data.deletedAt,
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
			number_of_containers: Number(data.number_of_containers),
			current_quantity: parseFloat(data.current_quantity),
			id_unit_measurement_fk: data.unit,
			cas: data.cas || null,
			control_tracking: data.control_tracking,
			expiration_date: data.expiration_date ? moment(data.expiration_date).format('YYYY-MM-DD HH:mm:ssZ') : null,
		}
	}

	static toUpdate(data) {
		return {
			code: data.code,
			name: data.name,
			number_of_containers: Number(data.number_of_containers),
			current_quantity: parseFloat(data.current_quantity),
			id_unit_measurement_fk: data.unit,
			cas: data.cas || null,
			control_tracking: data.control_tracking,
			expiration_date: data.expiration_date ? moment(data.expiration_date).format('YYYY-MM-DD HH:mm:ssZ') : null,
		}
	}
}
