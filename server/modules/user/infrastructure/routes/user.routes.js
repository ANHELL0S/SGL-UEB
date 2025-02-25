import { Router } from 'express'
import { UserController } from '../controller/UserController.js'
import { Auth } from '../../../../shared/middlewares/auth-middleware.js'
import { ROLES } from '../../../../shared/constants/roles-const.js'
import { hasRole } from '../../../../shared/middlewares/role-middleware.js'
import { limiterRequest } from '../../../../shared/middlewares/rateLimit-middleware.js'

const router = Router()

router.get(
	'/',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.SUPERVISOR, ROLES.TECHNICAL_ANALYST, ROLES.ACCESS_MANAGER, ROLES.DIRECTOR]),
	UserController.getAllUsers
)
router.get('/me', Auth, UserController.getMeUser)
router.get('/:id', Auth, UserController.getUserById)

router.post('/', Auth, hasRole([ROLES.GENERAL_ADMIN]), UserController.createUser)
router.post('/manager-role', Auth, hasRole([ROLES.GENERAL_ADMIN]), UserController.managerUserRoles)
//router.put('/password', limiterRequest({ maxRequests: 3, time: '5m' }), Auth, UserController.updatePassword)
router.put('/:id', Auth, hasRole([ROLES.GENERAL_ADMIN]), UserController.updateUser)
router.put('/:id/status', Auth, hasRole([ROLES.GENERAL_ADMIN]), UserController.changeStatusUser)
router.put('/:id/restore', Auth, hasRole([ROLES.GENERAL_ADMIN]), UserController.restoreUser)
router.delete('/:id', Auth, hasRole([ROLES.GENERAL_ADMIN]), UserController.deleteUser)
router.delete('/:id/permanent', Auth, hasRole([ROLES.GENERAL_ADMIN]), UserController.deletePermanentUser)
router.get('/report/pdf', Auth, hasRole([ROLES.GENERAL_ADMIN]), UserController.generatePdfReport)

export default router
