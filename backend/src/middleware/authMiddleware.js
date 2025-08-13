const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).send('Access denied.');
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send('Invalid token.');
        req.user = user;
        next();
    });
};

exports.authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).send('Forbidden: insufficient permissions.');
        }
        next();
    };
};
