import express from 'express'
import labRoutes from '../modules/lab/infrastructure/routes/lab.routes.js'
import facultyRoutes from '../modules/faculty/routes/experiment.routes.js'
import accessLabRoutes from '../modules/access/routes/accesslab.routes.js'
import userRoutes from '../modules/user/infrastructure/routes/user.routes.js'
import authRoutes from '../modules/auth/infrastructure/routes/auth.routes.js'
import roleRoutes from '../modules/role/infrastructure/routes/role.routes.js'
import logRoutes from '../modules/logger/infrastructure/routes/log.routes.js'
import experimentRoutes from '../modules/experiment/routes/experiment.routes.js'
import reportRoutes from '../modules/report/infrastructure/routes/report.routes.js'
import quotesRoutes from '../modules/quotes/infrastructure/routes/quotes.routes.js'
import sampleRoutes from '../modules/sample/infrastructure/routes/sample.routes.js'
import kardexRoutes from '../modules/kardex/infrastructure/routes/kardex.routes.js'
import reactiveRoutes from '../modules/reactive/infrastructure/routes/reactive.routes.js'
import unitMeasurementRoutes from '../modules/unitMeasurement/infrastructure/routes/UnitMeasurement.routes.js'
import consumptionReactiveRoutes from '../modules/consumption_reactive/infrastructure/routes/consumption.routes.js'

const router = express.Router()

router.use('/log', logRoutes)
router.use('/lab', labRoutes)
router.use('/auth', authRoutes)
router.use('/user', userRoutes)
router.use('/role', roleRoutes)
router.use('/quote', quotesRoutes)
router.use('/kardex', kardexRoutes)
router.use('/sample', sampleRoutes)
router.use('/report', reportRoutes)
router.use('/faculty', facultyRoutes)
router.use('/access', accessLabRoutes)
router.use('/reactive', reactiveRoutes)
router.use('/experiment', experimentRoutes)
router.use('/unit-measurement', unitMeasurementRoutes)
router.use('/consumption-reactive', consumptionReactiveRoutes)

export default router
