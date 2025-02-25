import { Router } from 'express'
import { Auth } from '../../../shared/middlewares/auth-middleware.js'
import { hasRole } from '../../../shared/middlewares/role-middleware.js'
import { AccessLabController } from '../controller/AccessLabController.js'
import { ROLES } from '../../../shared/constants/roles-const.js'
import { ApplicantController } from '../controller/ApplicantController.js'
import { AsignedLabController } from '../controller/AsignedLabController.js'
import { AnalysisController } from '../controller/AnalysisController.js'

const router = Router()

router.get(
	'/',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.SUPERVISOR, ROLES.TECHNICAL_ANALYST, ROLES.ACCESS_MANAGER, ROLES.DIRECTOR]),
	AccessLabController.getAll
)
router.get(
	'/:id/pertain-lab',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.ACCESS_MANAGER, ROLES.DIRECTOR, ROLES.SUPERVISOR]),
	AccessLabController.getAllPertainLab
)
router.get(
	'/pertain-to-analyst',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.TECHNICAL_ANALYST]),
	AccessLabController.getAllPertainToAnalyst
)
router.get(
	'/:code/by-code',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.ACCESS_MANAGER, ROLES.DIRECTOR, ROLES.TECHNICAL_ANALYST]),
	Auth,
	AccessLabController.getByCode
)
router.get(
	'/:id',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.ACCESS_MANAGER, ROLES.DIRECTOR, ROLES.TECHNICAL_ANALYST]),
	Auth,
	AccessLabController.getById
)
router.post('/', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.ACCESS_MANAGER]), AccessLabController.create)
router.put('/:id', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.ACCESS_MANAGER]), AccessLabController.update)
router.put('/:id/restore', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.ACCESS_MANAGER]), AccessLabController.restore)
router.delete(
	'/:id/permanent',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.ACCESS_MANAGER]),
	AccessLabController.deletePermanent
)
router.delete('/:id', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.ACCESS_MANAGER]), AccessLabController.delete)
router.put('/:id/status', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.DIRECTOR]), AccessLabController.changeStatus)

// APPLICANT
router.post('/applicant', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.ACCESS_MANAGER]), ApplicantController.create)
router.put('/:id/applicant', Auth, hasRole([ROLES.GENERAL_ADMIN, ROLES.ACCESS_MANAGER]), ApplicantController.update)
router.delete(
	'/:id/applicant',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.ACCESS_MANAGER]),
	ApplicantController.deletePermanent
)

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

// ANALYSIS
router.get(
	'/:id/analysis-pertain-access',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.ACCESS_MANAGER, ROLES.TECHNICAL_ANALYST]),
	AnalysisController.getAllAnalysisByAccessId
)
router.post(
	'/analysis-pertain-access',
	Auth,
	hasRole([ROLES.GENERAL_ADMIN, ROLES.ACCESS_MANAGER]),
	AnalysisController.createAnalysisToAccess
)

export default router
