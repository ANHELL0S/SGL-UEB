export class AsignedLabEntity {
	constructor(data) {
		this.id_access_lab = data.id_access_lab
		this.access = data.access
		this.lab = data.laboratory
		this.createdAt = data.createdAt
		this.updatedAt = data.updatedAt
		this.deletedAt = data.deletedAt
	}
}
