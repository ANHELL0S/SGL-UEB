import { Router } from 'express'
import { UserController } from '../controller/UserController.js'
import { Auth } from '../../../../shared/middlewares/auth-middleware.js'
import { GENERAL_ADMIN } from '../../../../shared/constants/roles-const.js'
import { hasRole } from '../../../../shared/middlewares/role-middleware.js'
import { limiterRequest } from '../../../../shared/middlewares/rateLimit-middleware.js'

const router = Router()

router.get('/', Auth, UserController.getAllUsers)
router.get('/me', Auth, UserController.getMeUser)
router.get('/:id', Auth, UserController.getUserById)

router.post('/', Auth, hasRole([GENERAL_ADMIN]), UserController.createUser)
router.post('/manager-role', Auth, hasRole([GENERAL_ADMIN]), UserController.managerUserRoles)
//router.put('/password', limiterRequest({ maxRequests: 3, time: '5m' }), Auth, UserController.updatePassword)
router.put('/:id', Auth, hasRole([GENERAL_ADMIN]), UserController.updateUser)
router.put('/:id/status', Auth, hasRole([GENERAL_ADMIN]), UserController.changeStatusUser)
router.delete('/:id', Auth, hasRole([GENERAL_ADMIN]), UserController.deleteUser)
router.get('/report/pdf', Auth, hasRole([GENERAL_ADMIN]), UserController.generatePdfReport)

export default router
