export const privateRouter = (req, res, next) => {
    if (req.session.user) return res.redirect('/profile')
    next()
}

export const publicRouter = (req, res, next) => {
    if (!req.session.user) return res.redirect('/')
    next()
}