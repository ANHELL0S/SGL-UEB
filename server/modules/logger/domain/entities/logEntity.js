export class LogEntity {
	constructor(data) {
		this.id_log = data?.id_log
		this.level = data?.level
		this.user = data?.user
		this.message = data?.message
		this.action = data?.action
		this.httpMethod = data?.httpMethod
		this.meta = data?.meta
		this.ipAddress = data?.ipAddress
		this.endpoint = data?.endpoint
		this.updatedAt = data?.updatedAt
		this.createdAt = data?.createdAt
		this.deletedAt = data?.deletedAt
	}
}
