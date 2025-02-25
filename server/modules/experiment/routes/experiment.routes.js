import { Router } from 'express'
import { ROLES } from '../../../shared/constants/roles-const.js'
import { Auth } from '../../../shared/middlewares/auth-middleware.js'
import { hasRole } from '../../../shared/middlewares/role-middleware.js'
import { CetegoryController } from '../controller/CategoryController.js'
import { ParameterController } from '../controller/ParameterController.js'

const router = Router()

// CATEGORY
router.get(
	'/category',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.SUPERVISOR, ROLES.TECHNICAL_ANALYST, ROLES.ACCESS_MANAGER, ROLES.DIRECTOR]),
	CetegoryController.getAll
)
router.post('/category', Auth, hasRole([ROLES.SUPERVISOR, ROLES.TECHNICAL_ANALYST]), CetegoryController.create)
router.put('/category/:id', Auth, hasRole([ROLES.SUPERVISOR, ROLES.TECHNICAL_ANALYST]), CetegoryController.update)
router.put(
	'/category/:id/restore',
	Auth,
	hasRole([ROLES.SUPERVISOR, ROLES.TECHNICAL_ANALYST]),
	CetegoryController.restore
)
router.delete('/category/:id', Auth, hasRole([ROLES.SUPERVISOR, ROLES.TECHNICAL_ANALYST]), CetegoryController.delete)
router.delete(
	'/category/:id/permanent',
	Auth,
	hasRole([ROLES.SUPERVISOR, ROLES.TECHNICAL_ANALYST]),
	CetegoryController.deletePermanent
)

// PARAMETER
router.get(
	'/parameter/:id/access',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.ACCESS_MANAGER, ROLES.SUPERVISOR, ROLES.TECHNICAL_ANALYST]),
	ParameterController.getAllToAcess
)
router.get(
	'/parameter',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.ACCESS_MANAGER, ROLES.SUPERVISOR, ROLES.TECHNICAL_ANALYST]),
	ParameterController.getAll
)
router.post('/parameter', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.TECHNICAL_ANALYST]), ParameterController.create)
router.put('/parameter/:id', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.TECHNICAL_ANALYST]), ParameterController.update)
router.put(
	'/parameter/:id/restore',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.TECHNICAL_ANALYST]),
	ParameterController.restore
)
router.delete(
	'/parameter/:id',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.TECHNICAL_ANALYST]),
	ParameterController.delete
)
router.delete(
	'/parameter/:id/permanent',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.TECHNICAL_ANALYST]),
	ParameterController.deletePermanent
)
router.put(
	'/parameter/:id/status',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.TECHNICAL_ANALYST]),
	ParameterController.changeStatus
)

export default router
