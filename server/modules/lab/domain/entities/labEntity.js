export class LabEntity {
	constructor(lab) {
		this.id_lab = lab.id_lab
		this.active = lab.active
		this.name = lab.name
		this.location = lab.location
		this.description = lab.description
		this.analysts = this.processAnalysts(lab.laboratory_analyst)
		this.access = this.processAccess(lab.access_labs)
		this.totalAccess = this.access.length
		this.updatedAt = lab.updatedAt
		this.createdAt = lab.createdAt
		this.deletedAt = lab.deletedAt
	}

	processAnalysts(analysts) {
		return analysts?.user?.full_name
	}

	processAccess(access_labs) {
		return (
			access_labs?.map(access => ({
				data: access,
			})) ?? []
		)
	}

	isActive() {
		return this.active
	}

	hideSensitiveData() {
		return {
			id_lab: this.id_lab,
			active: this.active,
			name: this.name,
			location: this.location,
			description: this.description,
			analysts: this.analysts,
			access: this.access,
			totalAccess: this.totalAccess,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
			deletedAt: this.deletedAt,
		}
	}
}
