"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticatedAdmin = exports.authenticated = void 0;
var auth_helpers_1 = require("../helpers/auth-helpers");
var authenticated = function (req, res, next) {
    if ((0, auth_helpers_1.ensureAuthenticated)(req)) {
        return next();
    }
    else {
        res.redirect('/signin');
    }
};
exports.authenticated = authenticated;
var authenticatedAdmin = function (req, res, next) {
    if ((0, auth_helpers_1.ensureAuthenticated)(req)) {
        var user = (0, auth_helpers_1.getUser)(req);
        if (user && user.isAdmin)
            return next();
        res.redirect('/');
    }
    else {
        res.redirect('/signin');
    }
};
exports.authenticatedAdmin = authenticatedAdmin;
