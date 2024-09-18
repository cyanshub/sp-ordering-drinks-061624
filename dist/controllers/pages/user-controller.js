"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var user_services_1 = __importDefault(require("../../services/user-services"));
var userController = {
    signUpPage: function (req, res, next) {
        return res.render('users/signup');
    },
    signUp: function (req, res, next) {
        return user_services_1.default.signUp(req, function (err, data) {
            if (err)
                return next(err);
            req.flash('success_messages', '成功註冊帳號!');
            return res.redirect('/signin');
        });
    },
    signInPage: function (req, res, next) {
        return res.render('users/signin');
    },
    signIn: function (req, res, next) {
        req.flash('success_messages', '登入成功!');
        return res.redirect('/stores');
    },
    logOut: function (req, res, next) {
        req.logout(function (err) {
            if (err) {
                return next(err);
            }
            req.flash('success_messages', '登出成功!');
            return res.redirect('/signin');
        });
    },
    getUser: function (req, res, next) {
        return user_services_1.default.getUser(req, function (err, data) { return (err ? next(err) : res.render('users/profile', data)); });
    },
    editUser: function (req, res, next) {
        return user_services_1.default.editUser(req, function (err, data) { return (err ? next(err) : res.render('users/edit-user', data)); });
    },
    putUser: function (req, res, next) {
        return user_services_1.default.putUser(req, function (err, data) {
            if (err) {
                return next(err);
            }
            console.log('測試:', data);
            req.flash('success_messages', '已變更成功!');
            return res.redirect("/users/".concat(data === null || data === void 0 ? void 0 : data.user.id));
        });
    },
    putAvatar: function (req, res, next) {
        return user_services_1.default.putAvatar(req, function (err, data) {
            if (err)
                return next(err);
            req.flash('success_messages', '成功移除頭像!');
            return res.redirect('back');
        });
    },
    getCarts: function (req, res, next) {
        return user_services_1.default.getCarts(req, function (err, data) { return (err ? next(err) : res.render('users/carts', data)); });
    },
    addCart: function (req, res, next) {
        return user_services_1.default.addCart(req, function (err, data) {
            if (err)
                return next(err);
            req.flash('success_messages', '商品已成功加入購物車!');
            return res.redirect('/carts');
        });
    },
    removeCart: function (req, res, next) {
        return user_services_1.default.removeCart(req, function (err, data) {
            if (err)
                return next(err);
            req.flash('success_messages', '成功退回訂單');
            return res.redirect("/stores/".concat(data === null || data === void 0 ? void 0 : data.cart.storeId));
        });
    },
    getOrders: function (req, res, next) {
        return user_services_1.default.getOrders(req, function (err, data) { return (err ? next(err) : res.render('users/orders', data)); });
    },
    addOrders: function (req, res, next) {
        return user_services_1.default.addOrders(req, function (err, data) {
            if (err)
                return next(err);
            req.flash('success_messages', '已建立訂單, 並成功寄出郵件!');
            return res.redirect('/orders');
        });
    }
};
exports.default = userController;
