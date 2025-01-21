import { Router } from 'express'
import { Auth } from '../../../shared/middlewares/auth-middleware.js'
import { SUPERVISOR } from '../../../shared/constants/roles-const.js'
import { hasRole } from '../../../shared/middlewares/role-middleware.js'
import { ExperimentController } from '../controller/ExperimentController.js'

const router = Router()

router.get('/', Auth, ExperimentController.getAll)
router.post('/', Auth, hasRole([SUPERVISOR]), ExperimentController.create)
router.put('/:id', Auth, hasRole([SUPERVISOR]), ExperimentController.update)
router.delete('/:id', Auth, hasRole([SUPERVISOR]), ExperimentController.delete)
router.put('/:id/status', Auth, hasRole([SUPERVISOR]), ExperimentController.changeStatus)
export default router
