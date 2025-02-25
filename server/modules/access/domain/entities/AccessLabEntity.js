import { STATUS_ACCESS } from '../../../../shared/constants/access-const.js'

export class AccessLabEntity {
	constructor(data) {
		this.id_access = data?.id_access
		this.code = data?.code
		this.resolution_approval = data?.resolution_approval
		this.reason = data?.reason
		this.topic = data?.topic
		this.datePermanenceStart = this.formatDate(data?.datePermanenceStart)
		this.datePermanenceEnd = this.formatDate(data?.datePermanenceEnd)
		this.observations = data?.observations
		this.status = this.setStatusInSpanish(data?.status)
		this.type_access = data?.type_access
		this.attached = data?.attached
		this.grupe = data?.grupe
		this.clauses = data?.clauses
		this.createdAt = data?.createdAt
		this.updatedAt = data?.updatedAt
		this.deletedAt = data?.deletedAt

		// Relaciones con facultades, carreras, laboratorios, directores, postulantes y experimentos
		this.quote = data.quote
		this.faculties = data?.access_faculties
		this.careers = data?.access_careers
		this.labs = this.processLabs(data?.access_labs)
		this.directors = this.processDirectors(data?.access_directors)
		this.applicants = data?.access_applicants
		this.experiments = this.processAnalysis(data?.access_analyses)
		this.samples = this.processSamples(data?.samples)
	}

	formatDate(dateString) {
		if (!dateString) return null
		const date = new Date(dateString)
		if (isNaN(date)) return null
		const year = date.getFullYear()
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const day = String(date.getDate()).padStart(2, '0')
		return `${year}-${month}-${day}`
	}

	// Método para formatear la hora a HH:MM
	formatTime(timeString) {
		if (!timeString) return null
		const [hours, minutes] = timeString.split(':')
		return `${hours}:${minutes}`
	}

	// Método para traducir el estado
	setStatusInSpanish(status) {
		switch (status) {
			case STATUS_ACCESS.PENDING:
				return STATUS_ACCESS.PENDING_ES
			case STATUS_ACCESS.APPROVED:
				return STATUS_ACCESS.APPROVED_ES
			case STATUS_ACCESS.REJECTED:
				return STATUS_ACCESS.REJECTED_ES
			default:
				return status
		}
	}

	// Métodos para procesar relaciones
	processFaculties(facultyData) {
		return (
			facultyData?.map(faculty => ({
				id_faculty: faculty?.faculty?.id_faculty,
				name: faculty?.faculty?.name,
			})) ?? []
		)
	}

	processCareers(careerData) {
		return (
			careerData?.map(career => ({
				id_career: career?.career?.id_career,
				name: career?.career?.name,
			})) ?? []
		)
	}

	processSamples(samples) {
		return samples
			? samples.map(data => ({
					sample: data,
			  }))
			: []
	}

	processAnalysis(access_analyses) {
		return access_analyses
			? access_analyses.map(data => ({
					analysis: data,
			  }))
			: []
	}

	processLabs(labData) {
		return (
			labData?.map(lab => ({
				lab: lab?.laboratory,
				analyst: lab?.laboratory?.laboratory_analyst?.user,
			})) ?? []
		)
	}

	processDirectors(directorData) {
		return (
			directorData?.map(director => ({
				name: director?.name,
				dni: director?.dni,
				email: director?.email,
			})) ?? []
		)
	}

	processApplicants(applicantData) {
		return (
			applicantData?.map(applicant => ({
				name: applicant?.name,
				dni: applicant?.dni,
				email: applicant?.email,
			})) ?? []
		)
	}
}
