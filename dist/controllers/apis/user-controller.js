"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var user_services_1 = __importDefault(require("../../services/user-services"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var userController = {
    signUp: function (req, res, next) {
        return user_services_1.default.signUp(req, function (err, data) { return (err ? next(err) : res.json({ status: 200, data: data })); });
    },
    signIn: function (req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ status: 'error', message: 'User not authenticated' });
            }
            var userData = req.user.toJSON ? req.user.toJSON() : req.user;
            delete userData.password;
            var token = jsonwebtoken_1.default.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' });
            return res.json({
                status: 200,
                data: {
                    token: token,
                    user: userData
                }
            });
        }
        catch (err) {
            next(err);
        }
    },
    getUser: function (req, res, next) {
        return user_services_1.default.getUser(req, function (err, data) { return (err ? next(err) : res.json({ status: 200, data: data })); });
    },
    editUser: function (req, res, next) {
        return user_services_1.default.editUser(req, function (err, data) { return (err ? next(err) : res.json({ status: 200, data: data })); });
    },
    putUser: function (req, res, next) {
        return user_services_1.default.putUser(req, function (err, data) { return (err ? next(err) : res.json({ status: 200, data: data })); });
    },
    putAvatar: function (req, res, next) {
        return user_services_1.default.putAvatar(req, function (err, data) { return (err ? next(err) : res.json({ status: 200, data: data })); });
    },
    getCarts: function (req, res, next) {
        return user_services_1.default.getCarts(req, function (err, data) { return (err ? next(err) : res.json({ status: 200, data: data })); });
    },
    addCart: function (req, res, next) {
        return user_services_1.default.addCart(req, function (err, data) { return (err ? next(err) : res.json({ status: 200, data: data })); });
    },
    removeCart: function (req, res, next) {
        return user_services_1.default.removeCart(req, function (err, data) { return (err ? next(err) : res.json({ status: 200, data: data })); });
    },
    getOrders: function (req, res, next) {
        return user_services_1.default.getOrders(req, function (err, data) { return (err ? next(err) : res.json({ status: 200, data: data })); });
    },
    addOrders: function (req, res, next) {
        return user_services_1.default.addOrders(req, function (err, data) { return (err ? next(err) : res.json({ status: 200, data: data })); });
    }
};
exports.default = userController;
