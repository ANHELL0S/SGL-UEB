import { Router } from 'express'
import { ReactiveController } from '../controller/reactiveController.js'
import { Auth } from '../../../../shared/middlewares/auth-middleware.js'
import { hasRole } from '../../../../shared/middlewares/role-middleware.js'
import { FILE_TYPES } from '../../../../shared/constants/fileType-const.js'
import { uploadFile } from '../../../../shared/middlewares/uploadFile-middleware.js'
import { SUPERVISOR, TECHNICAL_ANALYST } from '../../../../shared/constants/roles-const.js'

const router = Router()

router.get('/', Auth, hasRole([SUPERVISOR, TECHNICAL_ANALYST]), ReactiveController.getAll)
router.post('/', Auth, hasRole([SUPERVISOR]), ReactiveController.create)
router.post(
	'/upload-file',
	Auth,
	hasRole([SUPERVISOR]),
	uploadFile(FILE_TYPES.XLSX.name),
	ReactiveController.uploadedFile
)
router.put('/:id/status', Auth, hasRole([SUPERVISOR]), ReactiveController.changeStatus)

//router.get('/:id', Auth, hasRole([SUPERVISOR]), ReactiveController.getById)
//router.get('/:name/find-name', Auth, hasRole([SUPERVISOR]), ReactiveController.findToName)
//router.put('/:id', Auth, hasRole([SUPERVISOR]), ReactiveController.update)
//router.delete('/:id', Auth, hasRole([SUPERVISOR]), ReactiveController.delete)

export default router
