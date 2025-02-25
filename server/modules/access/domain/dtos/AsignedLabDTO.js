export class AsignedLabDTO {
	static toResponse(data) {
		return {
			id_access_lab: data.id_access_lab,
			access: data.access,
			lab: data.lab,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
			deletedAt: data.deletedAt,
		}
	}

	static toCreate(data) {
		return {
			labs: data.labs.map(lab => ({
				id_lab_fk: lab.id,
			})),
			id_access_fk: data.access,
		}
	}
}
