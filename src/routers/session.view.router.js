import { Router } from 'express'
import { privateRouter, publicRouter } from '../middlewares/auth.middleware.js'
import UserDTO from '../dto/user.dto.js'

const router = Router()

router.get('/register', privateRouter, async(req, res) => {
    res.render('sessions/register')
})

router.get('/', privateRouter, async(req, res) => {
    res.render('sessions/login')
})


router.get('/profile', publicRouter, async(req, res) => {
    const userDTO = new UserDTO(req.session.user)
    res.render('sessions/profile', userDTO)
})


export default router