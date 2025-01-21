import { Router } from 'express'
import { Auth } from '../../../shared/middlewares/auth-middleware.js'
import { hasRole } from '../../../shared/middlewares/role-middleware.js'
import { AccessLabController } from '../controller/AccessLabController.js'
import { ACCESS_MANAGER, DIRECTOR, SUPERVISOR } from '../../../shared/constants/roles-const.js'

const router = Router()

router.get('/', Auth, hasRole([ACCESS_MANAGER, DIRECTOR, SUPERVISOR]), AccessLabController.getAll)
router.get(
	'/:id/pertain-lab',
	Auth,
	hasRole([ACCESS_MANAGER, DIRECTOR, SUPERVISOR]),
	AccessLabController.getAllPertainLab
)
router.get('/:id', Auth, hasRole([ACCESS_MANAGER, DIRECTOR]), Auth, AccessLabController.getById)
router.post('/', Auth, hasRole([ACCESS_MANAGER]), AccessLabController.create)
router.put('/:id', Auth, hasRole([ACCESS_MANAGER]), AccessLabController.update)
router.delete('/:id', Auth, hasRole([ACCESS_MANAGER]), AccessLabController.delete)
router.put('/:id/status', Auth, hasRole([DIRECTOR]), AccessLabController.changeStatus)

export default router
