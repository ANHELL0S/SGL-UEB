export class AccessLabEntity {
	constructor(data) {
		// Identificadores y claves foráneas
		this.id_access_lab = data.id_access_lab
		this.id_faculty_fk = data.faculty
		this.id_career_fk = data.career

		// Detalles del acceso
		this.reason = data.reason
		this.topic = data.topic
		this.startTime = data.startTime
		this.endTime = data.endTime
		this.observations = data.observations
		this.status = data.status

		// Información adicional
		this.director = data.director
		this.applicant = data.applicant
		this.type_access = data.type_access

		// Relación con los laboratorios
		// Convertimos `labs` a un arreglo de objetos con `id_lab`
		this.labs = data.labs ? data.labs.map(labId => ({ id_lab: labId })) : []

		// Información adicional
		this.attached = data.attached
		this.analysis_required = data.analysis_required

		// Timestamps
		this.createdAt = data.createdAt
	}

	/**
	 * Formatear datos para crear un registro en la base de datos.
	 * @param {Object} data - Datos sin procesar.
	 * @returns {Object} - Datos formateados para la creación.
	 */
	static formaterData(data) {
		return {
			id_faculty_fk: data.faculty,
			id_career_fk: data.career,
			reason: data.reason,
			topic: data.topic,
			observations: data.observations,
			startTime: data.startTime,
			endTime: data.endTime,
			director: data.director,
			applicant: data.applicant,
			type_access: data.type_access,
			id_lab_fk: data.labs.map(lab => lab.id_lab),
			attached: data.attached,
			analysis_required: data.analysis_required,
		}
	}
}
