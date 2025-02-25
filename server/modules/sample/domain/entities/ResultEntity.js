export class ResultEntity {
	constructor(data) {
		this.id_sample_result = data.id_sample_result
		this.sample = data.samples
		this.code_assigned_ueb = data.code_assigned_ueb
		this.results = data.results
		this.analysis = data.analysis
		this.date_result = data.date_result
		this.createdAt = data.createdAt
		this.updatedAt = data.updatedAt
		this.deletedAt = data.deletedAt
	}
}
