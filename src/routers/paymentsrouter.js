import { Router } from 'express'
import { createSession, afterPay, cancel } from '../controllers/payments.controller.js'
const router = Router()

router.post('/create-checkout-session', createSession)
router.get('/success/:ticket', afterPay)
router.get('/cancel', cancel)


export default router