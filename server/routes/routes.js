import express from 'express'
import userRoutes from '../modules/user/infrastructure/routes/user.routes.js'
import authRoutes from '../modules/auth/infrastructure/routes/auth.routes.js'
import roleRoutes from '../modules/role/infrastructure/routes/role.routes.js'
import labRoutes from '../modules/lab/infrastructure/routes/lab.routes.js'
import accessLabRoutes from '../modules/accessLab/routes/accesslab.routes.js'
import experimentRoutes from '../modules/experiment/routes/experiment.routes.js'
import facultyRoutes from '../modules/faculty/routes/experiment.routes.js'
import reactiveRoutes from '../modules/reactive/infrastructure/routes/reactive.routes.js'
import unitMeasurementRoutes from '../modules/unitMeasurement/infrastructure/routes/UnitMeasurement.routes.js'

// TODO: ENRUTADO CORRECTO PRIMERO ENDPOINT ESPECIFICAS

const router = express.Router()

// ENDPOINT AUTH
router.use('/auth', authRoutes)

// ENDPOINT LAB
router.use('/lab/experiment', experimentRoutes)
router.use('/lab/access', accessLabRoutes)
router.use('/lab', labRoutes)

// ENDPOINT REACTIVES
router.use('/reactive/unit-measurement', unitMeasurementRoutes)
router.use('/reactive', reactiveRoutes)

// ENDPOINT USER
router.use('/user', userRoutes)
router.use('/role', roleRoutes)

// ENDPOINT FACULTY
router.use('/faculty', facultyRoutes)

export default router
