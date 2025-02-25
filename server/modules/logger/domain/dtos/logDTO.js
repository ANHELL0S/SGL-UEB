export class LogDTO {
	static toResponse(data) {
		return {
			id_log: data?.id_log,
			level: data?.level,
			user: data?.user,
			message: data?.message,
			action: data?.action,
			httpMethod: data?.httpMethod,
			meta: data?.meta,
			ipAddress: data?.ipAddress,
			endpoint: data?.endpoint,
			updatedAt: data?.updatedAt,
			createdAt: data?.createdAt,
			deletedAt: data?.deletedAt,
		}
	}
}
