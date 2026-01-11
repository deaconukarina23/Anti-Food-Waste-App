function requireAuth(req, res, next) {
    if(!req.session.idUser) {
        return res.status(401).json({ message: 'Neautentificat' });
    }
    next();
}
module.exports = requireAuth;