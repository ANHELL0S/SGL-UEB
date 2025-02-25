export class SampleEntity {
	constructor(data) {
		this.id_sample = data.id_sample
		this.name = data.name
		this.amount = data.amount
		this.container = data.container
		this.status = data.status
		this.quote = data.quote
		this.unit_measurement = data.units_measurement
		this.results = this.processResults(data?.sample_results)
		this.user = data.user
		this.experiments = data.quotes_experiments
		this.createdAt = data.createdAt
		this.updatedAt = data.updatedAt
		this.deletedAt = data.deletedAt
	}

	processResults(sample_results) {
		return sample_results
			? sample_results.map(data => ({
					result: data,
			  }))
			: []
	}
}
