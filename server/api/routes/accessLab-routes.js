import { Router } from 'express'
import { Auth } from '../middlewares/auth-middleware.js'
import { hasRole } from '../middlewares/role-middleware.js'
import { ACCESS_MANAGER, DIRECTOR } from '../../const/roles-const.js'
import { accessLabController } from '../controllers/accessLab-controller.js'

const router = Router()

router.get('/all', Auth, accessLabController.getAllAccessLabs)
router.get('/get-by-id/:id', Auth, accessLabController.getAccessLabById)

router.post('/create', Auth, hasRole([ACCESS_MANAGER]), accessLabController.createAcessLab)
router.put('/update/:id', Auth, hasRole([ACCESS_MANAGER]), accessLabController.updateAcessLab)
router.get('/report/pdf', Auth, hasRole([ACCESS_MANAGER]), accessLabController.generatePdfReport)
router.delete('/delete/:id', Auth, hasRole([ACCESS_MANAGER]), accessLabController.deleteAcessLab)
router.post('/change-permission', Auth, hasRole([DIRECTOR]), accessLabController.changePermissionAcessLab)

export default router
