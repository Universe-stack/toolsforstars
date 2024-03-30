"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSuperuser = exports.isPublisher = exports.isAuthenticated = void 0;
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
};
exports.isAuthenticated = isAuthenticated;
const isPublisher = (req, res, next) => {
    const user = req.user;
    if (req.isAuthenticated() && user.role === 'publisher') {
        return next();
    }
    res.status(403).json({ message: 'Forbidden' });
};
exports.isPublisher = isPublisher;
const isSuperuser = (req, res, next) => {
    const user = req.user;
    if (req.isAuthenticated() && user.role === 'superuser') {
        return next();
    }
    res.status(403).json({ message: 'Forbidden' });
};
exports.isSuperuser = isSuperuser;
