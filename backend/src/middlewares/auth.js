const jwt = require('jsonwebtoken');
const { serverConfig } = require('../config');

const ROLE_MAP = {
    admin: 1,
    moderator: 2,
    user: 3
};

function authenticate(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing or invalid authorization header' });
    }

    const token = header.split(' ')[1];
    try {
        const payload = jwt.verify(token, serverConfig.JWT_SECRET);
        req.user = payload;
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

function optionalAuthenticate(req, res, next) {
    const header = req.headers.authorization;
    if (!header) {
        return next();
    }
    if (!header.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Invalid authorization header' });
    }
    const token = header.split(' ')[1];
    try {
        const payload = jwt.verify(token, serverConfig.JWT_SECRET);
        req.user = payload;
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

function requireRole(...roles) {
    const allowedRoleIds = roles.map((role) => ROLE_MAP[role]).filter(Boolean);
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!allowedRoleIds.includes(req.user.role_id)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        return next();
    };
}

module.exports = {
    authenticate,
    optionalAuthenticate,
    requireRole
};
