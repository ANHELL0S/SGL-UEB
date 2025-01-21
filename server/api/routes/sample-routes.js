import { Router } from 'express'
import { SUPERVISOR, TECHNICAL_ANALYST } from '../../const/roles-const.js'
import { Auth } from '../middlewares/auth-middleware.js'
import { hasRole } from '../middlewares/role-middleware.js'
import { sampleController } from '../controllers/sample-controller.js'

const router = Router()
router.get('/all', Auth, sampleController.getAllSample)
router.get('/get-by-id/:id', Auth, sampleController.getSampleById)

router.post('/create', Auth, hasRole([TECHNICAL_ANALYST]), sampleController.createSample)
router.put('/update/:id', Auth, hasRole([TECHNICAL_ANALYST]), sampleController.updateSample)
router.delete('/delete/:id', Auth, hasRole([TECHNICAL_ANALYST]), sampleController.deleteSample)
router.get('/report/pdf', Auth, hasRole([SUPERVISOR]), sampleController.generatePdfReport)

export default router
