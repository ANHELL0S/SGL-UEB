import { Router } from 'express'
import { LabController } from '../controller/LabController.js'
import { ROLES } from '../../../../shared/constants/roles-const.js'
import { Auth } from '../../../../shared/middlewares/auth-middleware.js'
import { hasRole } from '../../../../shared/middlewares/role-middleware.js'

const router = Router()

router.get(
	'/',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.SUPERVISOR, ROLES.TECHNICAL_ANALYST, ROLES.ACCESS_MANAGER, ROLES.DIRECTOR]),
	LabController.getAll
)
router.get('/:id', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.SUPERVISOR]), LabController.getById)
router.get('/:name/find-name', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.SUPERVISOR]), LabController.findToName)
router.post('/', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.SUPERVISOR]), LabController.create)
router.put('/:id', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.SUPERVISOR]), LabController.update)
router.put('/:id/restore', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.SUPERVISOR]), LabController.restore)
router.put('/:id/status', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.SUPERVISOR]), LabController.changeStatus)
router.post('/assing-analyst', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.SUPERVISOR]), LabController.assignAnalyst)
router.delete('/:id', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.SUPERVISOR]), LabController.delete)
router.delete('/:id/permanent', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.SUPERVISOR]), LabController.deletePermanent)
router.delete(
	'/:id/assing-analyst',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.SUPERVISOR]),
	LabController.removeAssignAnalyst
)
router.get('/report/pdf', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.SUPERVISOR]), LabController.generatePdfReport)

export default router
