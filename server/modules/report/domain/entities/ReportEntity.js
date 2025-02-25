export class ReportEntity {
	constructor(data) {
		this.id_report = data.id_report
		this.number = data.number
		this.senior_analyst = data.seniorAnalyst
		this.collaborating_analyst = data.collaboratingAnalyst
		this.code = data.code
		this.isIssued = data.isIssued
		this.sample = data.sample
		this.createdAt = data.createdAt
		this.updatedAt = data.updatedAt
		this.deletedAt = data.deletedAt
	}
}
