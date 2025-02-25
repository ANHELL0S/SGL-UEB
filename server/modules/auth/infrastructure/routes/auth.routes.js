import { Router } from 'express'
import { AuthController } from '../controller/AuthController.js'
import { verifyToken } from '../../../../shared/middlewares/verifyToken-middleware.js'
import { limiterRequest } from '../../../../shared/middlewares/rateLimit-middleware.js'

const router = Router()

router.post('/signin', limiterRequest({ maxRequests: 5, time: '1m' }), AuthController.signIn)
router.post('/logout', AuthController.logout)

router.post('/refresh-token', AuthController.refreshToken)
router.post(
	'/request-password-reset',
	limiterRequest({ maxRequests: 3, time: '1m' }),
	AuthController.requestPasswordReset
)
router.put('/reset-password/:id', AuthController.resetPassword)

export default router
