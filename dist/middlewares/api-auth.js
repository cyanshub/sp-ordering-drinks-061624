"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticatedAdmin = exports.authenticated = void 0;
var passport_1 = __importDefault(require("../config/passport"));
var authenticated = function (req, res, next) {
    passport_1.default.authenticate('jwt', { session: false }, function (err, user) {
        if (err || !user)
            return res.status(401).json({ status: 'error', message: 'unauthorized' });
        req.user = user;
        next();
    })(req, res, next);
};
exports.authenticated = authenticated;
var authenticatedAdmin = function (req, res, next) {
    if (req.user && req.user.isAdmin)
        return next();
    return res.status(403).json({ status: 'error', message: 'permission denied' });
};
exports.authenticatedAdmin = authenticatedAdmin;
