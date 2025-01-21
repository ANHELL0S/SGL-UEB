import { Router } from 'express'
import { Auth } from '../middlewares/auth-middleware.js'
import { hasRole } from '../middlewares/role-middleware.js'
import { ACCESS_MANAGER } from '../../const/roles-const.js'
import { paymentController } from '../controllers/payment-controller.js'

const router = Router()
router.get('/all', Auth, paymentController.getAllPayment)
router.get('/get-by-id/:id', Auth, paymentController.getPaymentById)

router.post('/create', Auth, hasRole([ACCESS_MANAGER]), paymentController.createPayment)
router.get('/report/pdf', Auth, hasRole([ACCESS_MANAGER]), paymentController.generatePdfReport)

export default router
