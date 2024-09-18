"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var _a = require('../models'), User = _a.User, Cart = _a.Cart, Drink = _a.Drink, Store = _a.Store, Size = _a.Size, Sugar = _a.Sugar, Ice = _a.Ice, Order = _a.Order;
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var file_helpers_1 = require("../helpers/file-helpers");
var array_helpers_1 = require("../helpers/array-helpers");
var pagination_helpers_1 = require("../helpers/pagination-helpers");
var sequelize_1 = require("sequelize");
var nodemailer_1 = __importDefault(require("nodemailer"));
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
var userServices = {
    signUpPage: function (req, cb) {
        return cb(null);
    },
    signUp: function (req, cb) {
        var _a = req.body, name = _a.name, email = _a.email, password = _a.password, passwordCheck = _a.passwordCheck;
        var Salt = 10;
        if (password !== passwordCheck)
            throw new Error('請再次確認密碼是否輸入正確');
        return User.findOne({ where: { email: email } })
            .then(function (user) {
            if (user)
                throw new Error('使用者信箱已經存在');
            return bcryptjs_1.default.hash(password, Salt);
        })
            .then(function (hash) {
            return User.create({
                name: name,
                email: email,
                password: hash,
                isAdmin: false
            });
        })
            .then(function (newUser) { return cb(null, { user: newUser }); })
            .catch(function (err) { return cb(err); });
    },
    signInPage: function (req, cb) {
        return cb(null);
    },
    signIn: function (req, cb) {
        return cb(null);
    },
    logOut: function (req, cb) {
        return cb(null);
    },
    getUser: function (req, cb) {
        var userId = Number(req.params.id);
        return User.findByPk(userId, {
            attributes: { exclude: ['password'] }
        })
            .then(function (user) {
            if (!user)
                throw Object.assign(new Error('使用者不存在!'), { status: 404 });
            user = user.toJSON();
            return cb(null, { user: user });
        })
            .catch(function (err) { return cb(err); });
    },
    editUser: function (req, cb) {
        if (Number(req.params.id) !== req.user.id)
            throw Object.assign(new Error('只能編輯自己的使用者資料!'), { status: 403 });
        return User.findByPk(Number(req.params.id), {
            attributes: { exclude: ['password'] },
            raw: true
        })
            .then(function (user) {
            if (!user)
                throw Object.assign(new Error('使用者不存在!'), { status: 404 });
            return cb(null, { user: user });
        })
            .catch(function (err) { return cb(err); });
    },
    putUser: function (req, cb) {
        var userAuth = req.user;
        if (Number(req.params.id) !== (userAuth === null || userAuth === void 0 ? void 0 : userAuth.id))
            throw Object.assign(new Error('只能編輯自己的使用者資料!'), { status: 403 });
        var name = req.body.name;
        if (!name.trim())
            throw Object.assign(new Error('需要輸入使用者名稱!'), { status: 422 });
        var file = req.file;
        return Promise.all([
            User.findByPk(Number(req.params.id), {
                attributes: { exclude: ['password'] }
            }),
            (0, file_helpers_1.localAvatarHandler)(file)
        ])
            .then(function (_a) {
            var user = _a[0], filePath = _a[1];
            if (!user)
                throw new Error('使用者不存在!');
            return user.update({
                name: name,
                avatar: filePath || user.avatar
            });
        })
            .then(function (updatedUser) { return cb(null, { user: updatedUser }); })
            .catch(function (err) { return cb(err); });
    },
    putAvatar: function (req, cb) {
        var userId = Number(req.params.userId);
        return User.findByPk(userId, {
            attributes: { exclude: ['password'] }
        })
            .then(function (user) {
            if (!user)
                throw Object.assign(new Error('使用者不存在!'), { status: 404 });
            return user.update({ avatar: null });
        })
            .then(function (updatedUser) { return cb(null, { user: updatedUser }); })
            .catch(function (err) { return cb(err); });
    },
    getCarts: function (req, cb) {
        var userAuth = req.user;
        return Cart.findAll({
            raw: true,
            nest: true,
            where: { userId: userAuth.id },
            include: [
                { model: User, attributes: { exclude: ['password'] } },
                Drink,
                Store,
                Size,
                Sugar,
                Ice
            ]
        })
            .then(function (carts) {
            if (!carts)
                throw Object.assign(new Error('購物車不存在'), { status: 404 });
            var data = (0, array_helpers_1.convertToTaiwanTime)(carts);
            return cb(null, { carts: data });
        })
            .catch(function (err) { return cb(err); });
    },
    addCart: function (req, cb) {
        var userId = req.user.id;
        var drinkId = Number(req.body.drinkId);
        var sizeId = Number(req.body.sizeId);
        var sugarId = Number(req.body.sugarId);
        var iceId = Number(req.body.iceId);
        var amount = Number(req.body.amount);
        if (!sizeId)
            throw Object.assign(new Error('請選擇中杯或大杯'), { status: 422 });
        if (!sugarId)
            throw Object.assign(new Error('請選擇甜度'), { status: 422 });
        if (!iceId)
            throw Object.assign(new Error('請選擇冰量!'), { status: 422 });
        if (!amount)
            throw Object.assign(new Error('請選擇購買杯數!'), { status: 422 });
        var storeId = Number(req.params.storeId);
        if (!storeId)
            throw Object.assign(new Error('店家不存在!'), { status: 404 });
        return Drink.findByPk(drinkId)
            .then(function (drink) {
            if (!drink)
                throw Object.assign(new Error('該商品不存在!'), { status: 404 });
            return Cart.create({
                userId: userId,
                drinkId: drinkId,
                sizeId: sizeId,
                sugarId: sugarId,
                iceId: iceId,
                amount: amount,
                storeId: storeId
            });
        })
            .then(function (newCart) { return cb(null, { cart: newCart }); })
            .catch(function (err) { return cb(err); });
    },
    removeCart: function (req, cb) {
        var cartId = Number(req.params.cartId);
        return Cart.findByPk(cartId)
            .then(function (cart) {
            if (!cart)
                throw Object.assign(new Error('此購物車商品不存在!'), { status: 404 });
            return cart.destroy();
        })
            .then(function (deletedCart) { return cb(null, { cart: deletedCart }); })
            .catch(function (err) { return cb(err); });
    },
    getOrders: function (req, cb) {
        var _a;
        var userAuth = req.user;
        var DEFAULT_LIMIT = 5;
        var page = Number(req.query.page) || 1;
        var limit = Number(req.query.limit) || DEFAULT_LIMIT;
        var offset = (0, pagination_helpers_1.getOffset)(limit, page);
        var keyword = req.query.keyword ? req.query.keyword.trim() : '';
        var whereClause = __assign({ userId: userAuth.id }, (keyword.length > 0
            ? (_a = {},
                _a[sequelize_1.Op.or] = [
                    (0, sequelize_1.literal)("LOWER(Drink.name) LIKE '%".concat(keyword.toLowerCase(), "%'")),
                    (0, sequelize_1.literal)("LOWER(Store.name) LIKE '%".concat(keyword.toLowerCase(), "%'")),
                    (0, sequelize_1.literal)("LOWER(Store.address) LIKE '%".concat(keyword.toLowerCase(), "%'")),
                    (0, sequelize_1.literal)("DATE_ADD(Order.created_at, INTERVAL 8 HOUR) LIKE '%".concat(keyword, "%'"))
                ],
                _a) : {}));
        return Order.findAndCountAll({
            raw: true,
            nest: true,
            where: whereClause,
            order: [['id', 'DESC']],
            include: [
                { model: User, attributes: { exclude: ['password'] } },
                Drink,
                Store,
                Size,
                Sugar,
                Ice
            ],
            offset: offset,
            limit: limit
        })
            .then(function (orders) {
            var ordersData = (0, array_helpers_1.convertToTaiwanTime)(orders.rows);
            return cb(null, {
                orders: ordersData,
                pagination: (0, pagination_helpers_1.getPagination)(limit, page, orders.count),
                isSearched: '/orders',
                keyword: keyword,
                find: 'orders',
                count: orders.count
            });
        })
            .catch(function (err) { return cb(err); });
    },
    addOrders: function (req, cb) {
        return Cart.findAll({ where: { userId: req.user.id } })
            .then(function (carts) {
            if (!carts)
                throw Object.assign(new Error('購物車沒有商品!'), { status: 404 });
            carts.forEach(function (cart) {
                return cart.destroy();
            });
            var createOrderPromises = carts.map(function (cart) {
                return Order.create({
                    userId: cart.userId,
                    drinkId: cart.drinkId,
                    sizeId: cart.sizeId,
                    sugarId: cart.sugarId,
                    iceId: cart.iceId,
                    amount: cart.amount,
                    storeId: cart.storeId
                });
            });
            return Promise.all(createOrderPromises);
        })
            .then(function (newOrders) {
            var _a;
            var newOrderIds = newOrders.map(function (order) { return order.dataValues.id; });
            var whereClause = { id: (_a = {}, _a[sequelize_1.Op.in] = newOrderIds, _a) };
            var includeClause = [{ model: User, attributes: { exclude: ['password'] } }, Drink, Store, Size, Sugar, Ice];
            return Order.findAll({
                where: whereClause,
                include: includeClause,
                raw: true,
                nest: true
            });
        })
            .then(function (newOrders) {
            var emailFrom = process.env.GMAIL_USER;
            var emailTo = req.body.emailTo;
            var emailSubject = '【通知】揪團訂飲料訂單成立';
            var msg = '';
            msg += '<p>您的訂單已成立, 訂購商品如下:</p><ul>';
            newOrders.forEach(function (order) {
                var _a, _b, _c, _d;
                msg += "<li style=\"margin-left:0; padding-left:0;\">".concat(order.amount, " \u676F <strong>").concat((_a = order.Size) === null || _a === void 0 ? void 0 : _a.level, "</strong> ").concat((_b = order.Ice) === null || _b === void 0 ? void 0 : _b.level, "\u3001").concat((_c = order.Sugar) === null || _c === void 0 ? void 0 : _c.level, "\u7684 <strong>").concat((_d = order.Drink) === null || _d === void 0 ? void 0 : _d.name, "</strong></li>");
            });
            msg += '</ul><p>此郵件為系統自動寄送, 請勿直接回覆, 謝謝!</p>';
            var emailMsgs = "\n          <html>\n            <body style=\"font-family: Arial, sans-serif; font-size: 14px;\">\n              ".concat(msg, "\n            </body>\n          </html>\n        ");
            var mailOptions = {
                from: emailFrom,
                to: emailTo,
                subject: emailSubject,
                html: emailMsgs
            };
            var transporter = nodemailer_1.default.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.GMAIL_USER,
                    pass: process.env.GMAIL_PASS
                }
            });
            transporter.sendMail(mailOptions, function (err, info) {
                if (err)
                    cb(err);
                console.log(info);
            });
            return cb(null, { orders: newOrders });
        })
            .catch(function (err) { return cb(err); });
    }
};
exports.default = userServices;
