"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var admin_services_1 = __importDefault(require("../../services/admin-services"));
var adminController = {
    getStores: function (req, res, next) {
        return admin_services_1.default.getStores(req, function (err, data) { return (err ? next(err) : res.json({ status: 200, data: data })); });
    },
    postStore: function (req, res, next) {
        return admin_services_1.default.postStore(req, function (err, data) { return (err ? next(err) : res.json({ status: 200, data: data })); });
    },
    getStore: function (req, res, next) {
        return admin_services_1.default.getStore(req, function (err, data) { return (err ? next(err) : res.json({ status: 200, data: data })); });
    },
    putStore: function (req, res, next) {
        return admin_services_1.default.putStore(req, function (err, data) { return (err ? next(err) : res.json({ status: 200, data: data })); });
    },
    deleteStore: function (req, res, next) {
        return admin_services_1.default.deleteStore(req, function (err, data) { return (err ? next(err) : res.json({ status: 200, data: data })); });
    },
    addOwnership: function (req, res, next) {
        return admin_services_1.default.addOwnership(req, function (err, data) { return (err ? next(err) : res.json({ status: 200, data: data })); });
    },
    removeOwnership: function (req, res, next) {
        return admin_services_1.default.removeOwnership(req, function (err, data) { return (err ? next(err) : res.json({ status: 200, data: data })); });
    },
    getUsers: function (req, res, next) {
        return admin_services_1.default.getUsers(req, function (err, data) { return (err ? next(err) : res.json({ status: 200, data: data })); });
    },
    patchUser: function (req, res, next) {
        return admin_services_1.default.patchUser(req, function (err, data) { return (err ? next(err) : res.json({ status: 200, data: data })); });
    },
    getOrders: function (req, res, next) {
        return admin_services_1.default.getOrders(req, function (err, data) { return (err ? next(err) : res.json({ status: 200, data: data })); });
    },
    deleteOrder: function (req, res, next) {
        return admin_services_1.default.deleteOrder(req, function (err, data) { return (err ? next(err) : res.json({ status: 200, data: data })); });
    }
};
exports.default = adminController;
