import { Router } from 'express'
import { LabController } from '../controller/LabController.js'
import { Auth } from '../../../../shared/middlewares/auth-middleware.js'
import { ACCESS_MANAGER, SUPERVISOR, TECHNICAL_ANALYST } from '../../../../shared/constants/roles-const.js'
import { hasRole } from '../../../../shared/middlewares/role-middleware.js'

const router = Router()

router.get('/', Auth, hasRole([SUPERVISOR, ACCESS_MANAGER, TECHNICAL_ANALYST]), LabController.getAll)
router.get('/:id', Auth, hasRole([SUPERVISOR]), LabController.getById)
router.get('/:name/find-name', Auth, hasRole([SUPERVISOR]), LabController.findToName)
router.post('/', Auth, hasRole([SUPERVISOR]), LabController.create)
router.put('/:id', Auth, hasRole([SUPERVISOR]), LabController.update)
router.delete('/:id', Auth, hasRole([SUPERVISOR]), LabController.delete)
router.put('/:id/status', Auth, hasRole([SUPERVISOR]), LabController.changeStatus)
router.post('/assing-analyst', Auth, hasRole([SUPERVISOR]), LabController.assignAnalyst)
router.delete('/:id/assing-analyst', Auth, hasRole([SUPERVISOR]), LabController.removeAssignAnalyst)
router.get('/report/pdf', Auth, hasRole([SUPERVISOR]), LabController.generatePdfReport)

export default router
