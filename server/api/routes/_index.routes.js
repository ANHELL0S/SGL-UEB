import express from 'express'
import labRoutes from './lab-routes.js'
import authRoutes from './auth-routes.js'
import userRoutes from './user-routes.js'
import roleRoutes from './role-routes.js'
import sampleRoutes from './sample-routes.js'
import kardexRoutes from './kardex-routes.js'
import paymentRoutes from './payment-routes.js'
import reactiveRoutes from './reactive-routes.js'
import accesslabRoutes from './accessLab-routes.js'
import consumptionRoutes from './consumption-routes.js'
import requestEeactiveRoutes from './requestReactive-routes.js'

const router = express.Router()

// Endpoints public
router.use('/auth/', authRoutes)

// Endpoints privates
router.use('/lab/', labRoutes)
router.use('/user/', userRoutes)
router.use('/role/', roleRoutes)
router.use('/sample/', sampleRoutes)
router.use('/kardex/', kardexRoutes)
router.use('/payment/', paymentRoutes)
router.use('/reactive/', reactiveRoutes)
router.use('/access-lab/', accesslabRoutes)
router.use('/consumption/', consumptionRoutes)
router.use('/request-reactive/', requestEeactiveRoutes)

export default router
