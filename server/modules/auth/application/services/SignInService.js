import { env } from '../../../../config/env-config.js'
import { SignInRepository } from '../repository/SignInRepository.js'
import { comparePassword } from '../../../../shared/helpers/bcrypt-helper.js'
import {
	convertJwtRefreshToMilliseconds,
	createAccessToken,
	createRefreshToken,
} from '../../../../shared/helpers/jwt-helper.js'

export class SignInService {
	static async signIn(email, password, res) {
		const userFound = await SignInRepository.findUserByEmail(email)
		if (!userFound) return { error: 'Crendenciales invalidas.' }
		if (userFound.active === false) return { error: 'Tu cuenta está suspendida temporalmente.' }

		const isPasswordValid = await comparePassword(password, userFound.password)
		if (!isPasswordValid) return { error: 'Crendenciales invalidas.' }

		const userRolesIntermediate = userFound.user_roles_intermediate.id_user_role_intermediate
		if (!userRolesIntermediate) return { error: 'User role intermediate ID not found.' }

		const userRoles = await SignInRepository.findUserRolesByIntermediateId(userRolesIntermediate)

		const roleIds = userRoles.map(userRole => userRole.id_rol_fk)
		if (roleIds.length === 0) return { error: 'No se encontraron roles del usuario.' }

		const jwtExpiredValue = env.JWT_EXPIRED
		const expiredTokenMaxAge = convertJwtRefreshToMilliseconds(jwtExpiredValue)

		const accessToken = await createAccessToken({ id: userFound.id_user, roles: roleIds })
		const refreshToken = await createRefreshToken({ id: userFound.id_user })

		res.cookie('accessToken', accessToken, {
			httpOnly: true,
			secure: env.NODE_ENV === 'production',
			sameSite: env.NODE_ENV === 'production' ? 'Strict' : 'Lax',
			path: '/',
			maxAge: expiredTokenMaxAge,
		})

		const jwtRefreshValue = env.JWT_REFRESH
		const refreshTokenMaxAge = convertJwtRefreshToMilliseconds(jwtRefreshValue)

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: env.NODE_ENV === 'production',
			sameSite: env.NODE_ENV === 'production' ? 'Strict' : 'Lax',
			path: '/',
			maxAge: refreshTokenMaxAge,
		})

		return {
			user: {
				id: userFound.id_user,
				roles: roleIds,
			},
			accessToken,
			refreshToken,
		}
	}
}
