"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var admin_services_1 = __importDefault(require("../../services/admin-services"));
var adminController = {
    getStores: function (req, res, next) {
        return admin_services_1.default.getStores(req, function (err, data) { return (err ? next(err) : res.render('admin/stores', data)); });
    },
    createStore: function (req, res, next) {
        return res.render('admin/create-store');
    },
    postStore: function (req, res, next) {
        return admin_services_1.default.postStore(req, function (err, data) {
            if (err)
                return next(err);
            req.flash('success_messages', '成功新增店家!');
            res.redirect('/admin/stores');
        });
    },
    getStore: function (req, res, next) {
        return admin_services_1.default.getStore(req, function (err, data) { return (err ? next(err) : res.render('admin/store', data)); });
    },
    editStore: function (req, res, next) {
        return admin_services_1.default.editStore(req, function (err, data) { return (err ? next(err) : res.render('admin/edit-store', data)); });
    },
    putStore: function (req, res, next) {
        return admin_services_1.default.putStore(req, function (err, data) {
            if (err)
                return next(err);
            req.flash('success_messages', '變更成功!');
            res.redirect('/admin/stores');
        });
    },
    deleteStore: function (req, res, next) {
        return admin_services_1.default.deleteStore(req, function (err, data) {
            if (err)
                return next(err);
            req.flash('success_messages', '刪除成功!');
            res.redirect('back');
        });
    },
    addOwnership: function (req, res, next) {
        return admin_services_1.default.addOwnership(req, function (err, data) {
            if (err)
                return next(err);
            return setTimeout(function () { return res.redirect('back'); }, 3000);
        });
    },
    removeOwnership: function (req, res, next) {
        return admin_services_1.default.removeOwnership(req, function (err, data) {
            if (err)
                return next(err);
            return setTimeout(function () { return res.redirect('back'); }, 3000);
        });
    },
    getUsers: function (req, res, next) {
        return admin_services_1.default.getUsers(req, function (err, data) { return (err ? next(err) : res.render('admin/users', data)); });
    },
    patchUser: function (req, res, next) {
        return admin_services_1.default.patchUser(req, function (err, data) {
            if (err)
                return next(err);
            res.redirect('back');
        });
    },
    getOrders: function (req, res, next) {
        return admin_services_1.default.getOrders(req, function (err, data) { return (err ? next(err) : res.render('admin/orders', data)); });
    },
    deleteOrder: function (req, res, next) {
        return admin_services_1.default.deleteOrder(req, function (err, data) {
            if (err)
                return next(err);
            return res.redirect('back');
        });
    }
};
exports.default = adminController;
