export class ApplicantDTO {
	static toCreate(data) {
		return {
			id_access_fk: data.access,
			name: data.name,
			dni: data.dni,
			email: data.email,
		}
	}

	static toUpdate(data) {
		return {
			id_access_fk: data.access,
			name: data.name,
			dni: data.dni,
			email: data.email,
		}
	}
}
