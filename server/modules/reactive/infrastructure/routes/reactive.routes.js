import { Router } from 'express'
import { ReactiveController } from '../controller/reactiveController.js'
import { Auth } from '../../../../shared/middlewares/auth-middleware.js'
import { hasRole } from '../../../../shared/middlewares/role-middleware.js'
import { FILE_TYPES } from '../../../../shared/constants/fileType-const.js'
import { uploadFile } from '../../../../shared/middlewares/uploadFile-middleware.js'
import { ROLES } from '../../../../shared/constants/roles-const.js'

const router = Router()

router.get(
	'/',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.SUPERVISOR, ROLES.TECHNICAL_ANALYST, ROLES.ACCESS_MANAGER, ROLES.DIRECTOR]),
	ReactiveController.getAll
)
router.post('/', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.SUPERVISOR]), ReactiveController.create)
router.post(
	'/upload-file',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.SUPERVISOR]),
	uploadFile(FILE_TYPES.XLSX.name),
	ReactiveController.uploadedFile
)
router.put('/:id', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.SUPERVISOR]), ReactiveController.update)
router.put('/:id/status', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.SUPERVISOR]), ReactiveController.changeStatus)
router.put('/:id/restore', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.SUPERVISOR]), ReactiveController.restore)
router.delete('/:id', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.SUPERVISOR]), ReactiveController.delete)
router.delete(
	'/:id/permanent',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.SUPERVISOR]),
	ReactiveController.deletePermanent
)

export default router
