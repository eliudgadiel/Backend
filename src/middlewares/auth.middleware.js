export const privateRouter = (req, res, next) => {
    if (req.session.user) return res.redirect('/profile')
    next()
}

export const publicRouter = (req, res, next) => {
    if (!req.session.user) return res.redirect('/')
    next()
}

export const handlePolicies = policies => (req, res, next) => {
    if (policies.includes('PUBLIC')) return next()
    if (!req.session.user) return res.status(401).json({status: 'error', error: 'you are not logged-in'})
    if (policies.length > 0) {
     if (!policies.includes(req.session.user.role.toUpperCase())) {
        return res.status(403).json({ status: ' error', error: 'you are not authorized'})
     }
    }
    next()
}