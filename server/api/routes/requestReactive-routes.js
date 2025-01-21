import { Router } from 'express'
import { SUPERVISOR } from '../../const/roles-const.js'
import { Auth } from '../middlewares/auth-middleware.js'
import { hasRole } from '../middlewares/role-middleware.js'
import { requestReactiveController } from '../controllers/requestReactive-controller.js'

const router = Router()

router.get('/all', Auth, requestReactiveController.getAllRequestReactives)
router.get('/get-by-id/:id', Auth, requestReactiveController.getRequestReactiveById)

router.post('/create', Auth, hasRole([SUPERVISOR]), requestReactiveController.createRequestReactive)
router.put('/update/:id', Auth, hasRole([SUPERVISOR]), requestReactiveController.updateRequestReactive)
router.delete('/delete/:id', Auth, hasRole([SUPERVISOR]), requestReactiveController.deleteRequestReactive)

export default router
