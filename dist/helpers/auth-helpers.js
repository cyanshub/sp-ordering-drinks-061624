"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAuthenticated = exports.getUser = void 0;
var getUser = function (req) {
    return req.user || null;
};
exports.getUser = getUser;
var ensureAuthenticated = function (req) {
    return req.isAuthenticated();
};
exports.ensureAuthenticated = ensureAuthenticated;
