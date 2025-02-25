import { Router } from 'express'
import { SampleController } from '../controller/SampleController.js'
import { SampleResultController } from '../controller/ResultController.js'
import { Auth } from '../../../../shared/middlewares/auth-middleware.js'
import { hasRole } from '../../../../shared/middlewares/role-middleware.js'
import { ROLES } from '../../../../shared/constants/roles-const.js'

const router = Router()

// SAMPLE
router.get(
	'/',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.SUPERVISOR, ROLES.TECHNICAL_ANALYST, ROLES.ACCESS_MANAGER, ROLES.DIRECTOR]),
	SampleController.getAll
)
router.get(
	'/:id/pertain-quote',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.TECHNICAL_ANALYST]),
	SampleController.getAllToQuote
)
router.post('/', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.TECHNICAL_ANALYST]), SampleController.create)
router.put('/:id', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.TECHNICAL_ANALYST]), SampleController.update)
router.delete('/:id/permanent', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.TECHNICAL_ANALYST]), SampleController.delete)
router.get('/:id/report', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.TECHNICAL_ANALYST]), SampleController.reportPDF)
router.get(
	'/:id/report-docx',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.TECHNICAL_ANALYST]),
	SampleController.reportWord
)

// RESULT
router.get(
	'/result/:id/pertain-sample',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.TECHNICAL_ANALYST]),
	SampleResultController.getAllToAccess
)
router.post('/result', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.TECHNICAL_ANALYST]), SampleResultController.create)
router.put('/result/:id', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.TECHNICAL_ANALYST]), SampleResultController.update)
router.delete(
	'/result/:id/permanent',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.TECHNICAL_ANALYST]),
	SampleResultController.delete
)

export default router
