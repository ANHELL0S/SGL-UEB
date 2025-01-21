import { Router } from 'express'
import { Auth } from '../middlewares/auth-middleware.js'
import { GENERAL_ADMIN } from '../../const/roles-const.js'
import { hasRole } from '../middlewares/role-middleware.js'
import { UserController } from '../controllers/user-controller.js'
import { limiterRequest } from '../middlewares/rateLimit-middleware.js'

const router = Router()
const userController = new UserController()

router.get('/', Auth, userController.getAllUsers)
router.get('/me', Auth, userController.getMeUser)
router.get('/:id', Auth, userController.getUserById)

router.put('/password', limiterRequest({ maxRequests: 3, time: '5m' }), Auth, userController.updatePassword)

router.post('/', Auth, hasRole([GENERAL_ADMIN]), userController.createUser)
router.put('/:id', Auth, hasRole([GENERAL_ADMIN]), userController.updateUser)
router.put('/:id/status', Auth, hasRole([GENERAL_ADMIN]), userController.changeStatusUser)
router.delete('/:id', Auth, hasRole([GENERAL_ADMIN]), userController.deleteUser)
router.get('/report/pdf', Auth, hasRole([GENERAL_ADMIN]), userController.generatePdfReport)

export default router
