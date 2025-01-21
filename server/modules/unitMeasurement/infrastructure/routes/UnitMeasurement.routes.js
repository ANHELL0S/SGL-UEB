import { Router } from 'express'
import { UnitMeasurementController } from '../controller/UnitMeasurementController.js'
import { Auth } from '../../../../shared/middlewares/auth-middleware.js'
import { SUPERVISOR, TECHNICAL_ANALYST } from '../../../../shared/constants/roles-const.js'
import { hasRole } from '../../../../shared/middlewares/role-middleware.js'

const router = Router()

router.get('/', Auth, hasRole([SUPERVISOR, TECHNICAL_ANALYST]), UnitMeasurementController.getAll)
router.get('/:id', Auth, hasRole([SUPERVISOR, TECHNICAL_ANALYST]), UnitMeasurementController.getById)
router.post('/', Auth, hasRole([SUPERVISOR]), UnitMeasurementController.create)
router.put('/:id', Auth, hasRole([SUPERVISOR]), UnitMeasurementController.update)
router.delete('/:id', Auth, hasRole([SUPERVISOR]), UnitMeasurementController.delete)

export default router
