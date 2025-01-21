import { STATUS_ACCESS } from '../../../../shared/constants/access-const.js'

export class AccessLabDTO {
	static toResponse(data) {
		let statusInSpanish
		switch (data.status) {
			case STATUS_ACCESS.PENDING:
				statusInSpanish = STATUS_ACCESS.PENDING_ES
				break
			case STATUS_ACCESS.APPROVED:
				statusInSpanish = STATUS_ACCESS.APPROVED_ES
				break
			case STATUS_ACCESS.REJECTED:
				statusInSpanish = STATUS_ACCESS.REJECTED_ES
				break
			default:
				statusInSpanish = data.status
				break
		}

		return {
			id_access: data.id_access,
			reason: data.reason,
			topic: data.topic,
			observations: data.observations,
			startTime: data.startTime,
			endTime: data.endTime,
			status: statusInSpanish,
			type_access: data.type_access,
			attached: data.attached,
			analysis_required: data.analysis_required,

			// Relaciones
			faculties: data.access_faculties?.map(faculty => ({
				id_faculty: faculty.faculty.id_faculty,
				name: faculty.faculty.name,
			})),
			careers: data.access_careers?.map(career => ({
				id_career: career.career.id_career,
				name: career.career.name,
			})),
			labs: data.access_labs?.map(lab => ({
				id_lab: lab.laboratory.id_lab,
				name_lab: lab.laboratory.name,
			})),
			directors: data.access_directors?.map(director => ({
				name: director.name,
				dni: director.dni,
				email: director.email,
			})),
			applicants: data.access_applicants?.map(applicant => ({
				name: applicant.name,
				dni: applicant.dni,
				email: applicant.email,
			})),

			createdAt: data.createdAt,
		}
	}
}
