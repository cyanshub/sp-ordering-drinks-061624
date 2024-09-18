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
Object.defineProperty(exports, "__esModule", { value: true });
var _a = require('../models'), Store = _a.Store, Drink = _a.Drink, User = _a.User, Ownership = _a.Ownership, Order = _a.Order, Size = _a.Size, Sugar = _a.Sugar, Ice = _a.Ice;
var pagination_helpers_1 = require("../helpers/pagination-helpers");
var sequelize_1 = require("sequelize");
var file_helpers_1 = require("../helpers/file-helpers");
var array_helpers_1 = require("../helpers/array-helpers");
var adminServices = {
    getStores: function (req, cb) {
        var _a;
        var DEFAULT_LIMIT = 10;
        var page = Number(req.query.page) || 1;
        var limit = Number(req.query.limit) || DEFAULT_LIMIT;
        var offset = (0, pagination_helpers_1.getOffset)(limit, page);
        var keyword = typeof req.query.keyword === 'string' ? req.query.keyword.trim() : '';
        var whereClause = __assign({}, (keyword.length > 0
            ? (_a = {},
                _a[sequelize_1.Op.or] = [
                    (0, sequelize_1.literal)("LOWER(Store.name) LIKE '%".concat(keyword.toLowerCase(), "%'")),
                    (0, sequelize_1.literal)("LOWER(Store.address) LIKE '%".concat(keyword.toLowerCase(), "%'"))
                ],
                _a) : {}));
        return Store.findAndCountAll({
            where: whereClause,
            raw: true,
            offset: offset,
            limit: limit,
            nest: true,
            order: [['id', 'DESC']]
        })
            .then(function (stores) {
            var data = stores.rows;
            return cb(null, {
                stores: data,
                pagination: (0, pagination_helpers_1.getPagination)(limit, page, stores.count),
                isSearched: '/admin/stores',
                keyword: keyword,
                find: 'stores'
            });
        })
            .catch(function (err) { return cb(err); });
    },
    createStore: function (req, cb) {
        return cb(null);
    },
    postStore: function (req, cb) {
        var _a = req.body, name = _a.name, address = _a.address, phone = _a.phone;
        var file = req.file;
        if (!name)
            throw Object.assign(new Error('店家名稱為必填欄位!'), { status: 422 });
        return (0, file_helpers_1.localCoverHandler)(file)
            .then(function (filePath) {
            return Store.create({
                name: name,
                address: address,
                phone: phone,
                cover: filePath || null
            });
        })
            .then(function (newStore) { return cb(null, { store: newStore }); })
            .catch(function (err) { return cb(err); });
    },
    getStore: function (req, cb) {
        var _a;
        var keyword = typeof req.query.keyword === 'string' ? req.query.keyword.trim() : '';
        var whereClause = __assign({}, (keyword.length > 0
            ? (_a = {},
                _a[sequelize_1.Op.or] = [(0, sequelize_1.literal)("LOWER(Drink.name) LIKE '%".concat(keyword.toLowerCase(), "%'"))],
                _a) : {}));
        return Promise.all([
            Store.findByPk(Number(req.params.id), {
                include: [
                    {
                        model: Drink,
                        as: 'ownedDrinks',
                        order: [['id', 'ASC']]
                    }
                ]
            }),
            Drink.findAll({
                raw: true,
                where: whereClause
            })
        ])
            .then(function (_a) {
            var store = _a[0], drinks = _a[1];
            if (!store)
                throw Object.assign(new Error('該商店不存在!'), { status: 404 });
            var ownedDrinksId = store.ownedDrinks ? store.ownedDrinks.map(function (od) { return od.id; }) : [];
            var drinksData = drinks.map(function (d) { return (__assign(__assign({}, d), { isOwned: ownedDrinksId.includes(d.id) })); });
            store = store.toJSON();
            return cb(null, {
                store: store,
                drinks: drinksData,
                isSearched: "/admin/stores/".concat(req.params.id),
                keyword: keyword,
                find: 'drinks'
            });
        })
            .catch(function (err) { return cb(err); });
    },
    editStore: function (req, cb) {
        return Store.findByPk(req.params.id, { raw: true })
            .then(function (store) {
            if (!store)
                throw Object.assign(new Error('該店家不存在!'), { status: 404 });
            return cb(null, { store: store });
        })
            .catch(function (err) { return cb(err); });
    },
    putStore: function (req, cb) {
        var storeId = Number(req.params.id);
        var _a = req.body, name = _a.name, address = _a.address, phone = _a.phone;
        if (!name) {
            throw Object.assign(new Error('案場名稱為必填欄位!'), { status: 422 });
        }
        var file = req.file;
        return Promise.all([Store.findByPk(storeId), (0, file_helpers_1.localCoverHandler)(file)])
            .then(function (_a) {
            var store = _a[0], filePath = _a[1];
            if (!store)
                throw Object.assign(new Error('該案場不存在!'), { status: 404 });
            return store.update({
                name: name,
                address: address,
                phone: phone,
                cover: filePath || store.cover
            });
        })
            .then(function (editedStore) { return cb(null, { store: editedStore }); })
            .catch(function (err) { return cb(err); });
    },
    deleteStore: function (req, cb) {
        return Store.findByPk(Number(req.params.id))
            .then(function (store) {
            if (!store)
                throw Object.assign(new Error('該案場不存在!'), { status: 404 });
            return store.destroy();
        })
            .then(function (deletedStore) { return cb(null, { store: deletedStore }); })
            .catch(function (err) { return cb(err); });
    },
    getUsers: function (req, cb) {
        return User.findAll({
            raw: true,
            attributes: { exclude: ['password'] }
        })
            .then(function (users) { return cb(null, { users: users }); })
            .catch(function (err) { return cb(err); });
    },
    patchUser: function (req, cb) {
        return User.findByPk(Number(req.params.id), {
            attributes: { exclude: ['password'] }
        })
            .then(function (user) {
            if (!user)
                throw Object.assign(new Error('使用者不存在!'), { status: 404 });
            if (user.email === 'root@example.com') {
                throw Object.assign(new Error('禁止變更 root 使用者權限!'), { status: 403 });
            }
            return user.update({
                isAdmin: !user.isAdmin
            });
        })
            .then(function (editedUser) { return cb(null, { user: editedUser }); })
            .catch(function (err) { return cb(err); });
    },
    addOwnership: function (req, cb) {
        var storeId = Number(req.body.storeId);
        var drinkId = Number(req.params.drinkId);
        return Promise.all([Drink.findByPk(drinkId), Ownership.findOne({ where: { storeId: storeId, drinkId: drinkId } })])
            .then(function (_a) {
            var drink = _a[0], ownership = _a[1];
            if (!drink)
                throw Object.assign(new Error('該商品不存在!'), { status: 404 });
            if (ownership)
                throw Object.assign(new Error('商品已在販賣清單!'), { status: 409 });
            return Ownership.create({ storeId: storeId, drinkId: drinkId });
        })
            .then(function (newOwnership) { return cb(null, { ownership: newOwnership }); })
            .catch(function (err) { return cb(err); });
    },
    removeOwnership: function (req, cb) {
        var storeId = Number(req.body.storeId);
        var drinkId = Number(req.params.drinkId);
        return Promise.all([Drink.findByPk(drinkId), Ownership.findOne({ where: { storeId: storeId, drinkId: drinkId } })])
            .then(function (_a) {
            var drink = _a[0], ownership = _a[1];
            if (!drink)
                throw Object.assign(new Error('該商品不存在!'), { status: 404 });
            if (!ownership)
                throw Object.assign(new Error('商品不在販賣清單!'), { status: 409 });
            var deletedOwnership = ownership;
            return ownership.destroy().then(function () { return deletedOwnership; });
        })
            .then(function (deletedOwnership) { return cb(null, { ownership: deletedOwnership }); })
            .catch(function (err) { return cb(err); });
    },
    getOrders: function (req, cb) {
        var _a;
        var userAuth = req.user;
        if ((userAuth === null || userAuth === void 0 ? void 0 : userAuth.email) !== 'root@example.com') {
            throw Object.assign(new Error('只有專責管理員可以訪問此頁面!'), { status: 403 });
        }
        var DEFAULT_LIMIT = 5;
        var page = Number(req.query.page) || 1;
        var limit = Number(req.query.limit) || DEFAULT_LIMIT;
        var offset = (0, pagination_helpers_1.getOffset)(limit, page);
        var keyword = typeof req.query.keyword === 'string' ? req.query.keyword.trim() : '';
        var whereClause = __assign({}, (keyword.length > 0
            ? (_a = {},
                _a[sequelize_1.Op.or] = [
                    (0, sequelize_1.literal)("LOWER(User.name) LIKE '%".concat(keyword.toLowerCase(), "%'")),
                    (0, sequelize_1.literal)("LOWER(User.email) LIKE '%".concat(keyword.toLowerCase(), "%'")),
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
            var data = (0, array_helpers_1.convertToTaiwanTime)(orders.rows);
            return cb(null, {
                orders: data,
                pagination: (0, pagination_helpers_1.getPagination)(limit, page, orders.count),
                isSearched: '/admin/orders',
                keyword: keyword,
                find: 'orders',
                count: orders.count
            });
        })
            .catch(function (err) { return cb(err); });
    },
    deleteOrder: function (req, cb) {
        var orderId = Number(req.params.orderId);
        return Order.findByPk(orderId)
            .then(function (order) {
            if (!order)
                throw Object.assign(new Error('指定的訂單不存在!'), { status: 404 });
            return order.destroy();
        })
            .then(function (deletedOrder) { return cb(null, { order: deletedOrder }); })
            .catch(function (err) { return cb(err); });
    }
};
exports.default = adminServices;
