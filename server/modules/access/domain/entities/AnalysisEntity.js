export class AnalysisEntity {
	constructor(data) {
		this.id_access_analysis = data.id_access_analysis
		this.analysis = data?.experiments_parameter
		this.amount = data.amount
		this.total_cost = data.total_cost
		this.createdAt = data.createdAt
		this.updatedAt = data.updatedAt
		this.deletedAt = data.deletedAt
	}
}
