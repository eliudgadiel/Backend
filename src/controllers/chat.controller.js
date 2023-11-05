import { publicRouter } from '../middlewares/auth.middleware.js'



export const chatController =  (publicRouter, (req, res) => {
    res.render('chat', {})
})