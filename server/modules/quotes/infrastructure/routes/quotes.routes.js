import { Router } from 'express'
import { QuotesController } from '../controller/QuotesController.js'
import { PaymentController } from '../controller/PaymentController.js'
import { Auth } from '../../../../shared/middlewares/auth-middleware.js'
import { hasRole } from '../../../../shared/middlewares/role-middleware.js'
import { ROLES } from '../../../../shared/constants/roles-const.js'
import { AsignedLabController } from '../controller/AsignedLabController.js'

const router = Router()

// QUOTE
router.get(
	'/',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.SUPERVISOR, ROLES.TECHNICAL_ANALYST, ROLES.ACCESS_MANAGER, ROLES.DIRECTOR]),
	QuotesController.getAll
)
router.get(
	'/pertain-to-analyst',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.TECHNICAL_ANALYST]),
	QuotesController.getAllPertainToAnalyst
)
router.get(
	'/:code/by-code',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.ACCESS_MANAGER, ROLES.DIRECTOR, ROLES.TECHNICAL_ANALYST]),
	Auth,
	QuotesController.getByCodeQuote
)
router.get(
	'/:id',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.SUPERVISOR, ROLES.ACCESS_MANAGER, ROLES.TECHNICAL_ANALYST, ROLES.DIRECTOR]),
	QuotesController.getById
)
router.post('/', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.ACCESS_MANAGER]), QuotesController.create)
router.put('/:id', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.ACCESS_MANAGER]), QuotesController.update)
router.delete(
	'/:id/permanent',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.ACCESS_MANAGER]),
	QuotesController.deletePermanent
)
router.delete('/:id', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.ACCESS_MANAGER]), QuotesController.delete)
router.put('/:id/status', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.DIRECTOR]), QuotesController.changeStatus)
router.put(
	'/:id/restore',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.ACCESS_MANAGER, ROLES.DIRECTOR]),
	QuotesController.restore
)

// BILL
router.put('/:id/bill', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.ACCESS_MANAGER]), PaymentController.addBill)

// ASIGNED LAB
router.get(
	'/:id/lab-asigned',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.ACCESS_MANAGER, ROLES.TECHNICAL_ANALYST]),
	AsignedLabController.getAllAsignedLabByQuoteId
)
router.post('/lab-asigned', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.ACCESS_MANAGER]), AsignedLabController.asignedLab)
router.delete(
	'/:id/lab-asigned',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.ACCESS_MANAGER]),
	AsignedLabController.deleteAsignedLab
)

export default router
