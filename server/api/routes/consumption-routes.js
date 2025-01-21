import { Router } from 'express'
import { Auth } from '../middlewares/auth-middleware.js'
import { hasRole } from '../middlewares/role-middleware.js'
import { SUPERVISOR, TECHNICAL_ANALYST } from '../../const/roles-const.js'
import { consumptionController } from '../controllers/consumption-controller.js'

const router = Router()

router.get('/all', Auth, consumptionController.getAllConsumptions)
router.get('/get-by-id/:id', Auth, consumptionController.getConsumptionsById)

router.post('/create', Auth, hasRole([TECHNICAL_ANALYST]), consumptionController.createConsumptionsReactive)
router.delete('/delete/:id', Auth, hasRole([TECHNICAL_ANALYST]), consumptionController.deleteConsumptionsReactive)
router.get('/report/pdf', Auth, hasRole([SUPERVISOR]), consumptionController.generatePdfReport)

export default router
