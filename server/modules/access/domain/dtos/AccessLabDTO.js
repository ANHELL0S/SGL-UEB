export class AccessLabDTO {
	static toResponse(data) {
		return {
			id_access: data?.id_access,
			quote: data?.quote,
			code: data?.code,
			status: data?.status,
			type_access: data?.type_access,
			resolution_approval: data?.resolution_approval,
			reason: data?.reason,
			topic: data?.topic,
			datePermanenceStart: data.datePermanenceStart,
			datePermanenceEnd: data.datePermanenceEnd,
			attached: data?.attached,
			experiments: data?.experiments,
			faculties: data?.faculties,
			careers: data?.careers,
			directors: data?.directors,
			applicants: data?.applicants,
			grupe: data?.grupe,
			labs: data?.labs,
			samples: data?.samples,
			observations: data?.observations,
			clauses: data?.clauses,
			createdAt: data?.createdAt,
			updatedAt: data?.updatedAt,
			deletedAt: data?.deletedAt,
		}
	}

	static toCreate(data) {
		return {
			type_quote: 'internal',
			id_faculty_fk: data.faculty,
			id_career_fk: data.career,
			experiments: data.experiments,
			resolution_approval: data.resolution_approval,
			reason: data.reason,
			topic: data.topic,
			datePermanenceStart: data.datePermanenceStart,
			datePermanenceEnd: data.datePermanenceEnd,
			director: data.director,
			applicant: data.applicant,
			grupe: data.grupe,
			labs: data.labs.map(lab => ({ id_lab_fk: lab })),
			attached: data.attached,
			observations: data.observations,
			clauses: data.clauses,
		}
	}

	static toUpdate(data) {
		return {
			type_quote: 'internal',
			id_faculty_fk: data.faculty,
			id_career_fk: data.career,
			experiments: data.experiments,
			resolution_approval: data.resolution_approval,
			reason: data.reason,
			topic: data.topic,
			datePermanenceStart: data.datePermanenceStart,
			datePermanenceEnd: data.datePermanenceEnd,
			director: data.director,
			applicant: data.applicant,
			grupe: data.grupe,
			labs: data.labs.map(lab => ({ id_lab_fk: lab })),
			attached: data.attached,
			observations: data.observations,
			clauses: data.clauses,
		}
	}

	static toChangeStatus(data) {
		return {
			status: data.status,
		}
	}
}
