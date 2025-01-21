import { Router } from 'express'
import { AuthController } from '../controller/AuthController.js'
import { limiterRequest } from '../../../../shared/middlewares/rateLimit-middleware.js'

const router = Router()

router.post('/signin', limiterRequest({ maxRequests: 5, time: '1m' }), AuthController.signIn)

export default router
