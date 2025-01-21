export class FacultyEntity {
	constructor(lab) {
		this.id_faculty = lab.id_faculty
		this.name = lab.name
		this.carrers = this.processCarerrs(lab.careers)
	}

	processCarerrs(careerData) {
		return (
			careerData?.map(carrer => ({
				id_career: carrer.id_career,
				name: carrer.name,
			})) ?? []
		)
	}

	hideSensitiveData() {
		return {
			id_faculty: this.id_faculty,
			name: this.name,
			carrers: this.carrers,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		}
	}
}
