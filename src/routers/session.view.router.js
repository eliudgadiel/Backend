import { Router } from 'express'
import { privateRouter, publicRouter } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/register', privateRouter, async(req, res) => {
    res.render('sessions/register')
})

router.get('/', privateRouter, async(req, res) => {
    res.render('sessions/login')
})


router.get('/profile', publicRouter, async(req, res) => {
    res.render('sessions/profile', req.session.user)
})


export default router