import { Router } from 'express'
import { publicRouter } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/', publicRouter, (req, res) => {
    res.render('chat', {})
})

export default router

