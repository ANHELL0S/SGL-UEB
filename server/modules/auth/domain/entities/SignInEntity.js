export class SignInEntity {
	constructor(id, email, password, active, roles) {
		this.id = id
		this.email = email
		this.password = password
		this.active = active
		this.roles = roles
	}
}
