export class FacultyDTO {
	static toResponse(entity) {
		return {
			id_faculty: entity.id_faculty,
			name: entity.name,
			carrers: entity.carrers,
		}
	}

	static toResponseList(entities) {
		return entities.map(entity => this.toResponse(entity))
	}
}
