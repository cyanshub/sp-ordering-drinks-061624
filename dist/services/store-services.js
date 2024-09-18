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
var _a = require('../models'), Store = _a.Store, Drink = _a.Drink, Size = _a.Size, Sugar = _a.Sugar, Ice = _a.Ice;
var pagination_helpers_1 = require("../helpers/pagination-helpers");
var sequelize_1 = require("sequelize");
var storeServices = {
    getStores: function (req, cb) {
        var _a;
        var DEFAULT_LIMIT = 12;
        var page = Number(req.query.page) || 1;
        var limit = Number(req.query.limit) || DEFAULT_LIMIT;
        var offset = (0, pagination_helpers_1.getOffset)(limit, page);
        var keyword = typeof req.query.keyword === 'string' ? req.query.keyword.trim() : '';
        return Store.findAndCountAll({
            raw: true,
            offset: offset,
            limit: limit,
            where: __assign({}, (keyword.length > 0
                ? (_a = {},
                    _a[sequelize_1.Op.or] = [
                        (0, sequelize_1.literal)("LOWER(Store.name) LIKE '%".concat(keyword.toLowerCase(), "%'")),
                        (0, sequelize_1.literal)("LOWER(Store.address) LIKE '%".concat(keyword.toLowerCase(), "%'"))
                    ],
                    _a) : {})),
            nest: true,
            order: [['id', 'DESC']]
        })
            .then(function (stores) {
            return cb(null, {
                stores: stores.rows,
                pagination: (0, pagination_helpers_1.getPagination)(limit, page, stores.count),
                isSearched: '/stores',
                keyword: keyword,
                find: 'stores'
            });
        })
            .catch(function (err) { return cb(err); });
    },
    getStore: function (req, cb) {
        var _a;
        var storeId = Number(req.params.id);
        var keyword = typeof req.query.keyword === 'string' ? req.query.keyword.trim() : '';
        var whereClause = __assign({}, (keyword.length > 0
            ? (_a = {},
                _a[sequelize_1.Op.or] = [(0, sequelize_1.literal)("LOWER(ownedDrinks.name) LIKE '%".concat(keyword.toLowerCase(), "%'"))],
                _a) : {}));
        return Promise.all([
            Store.findByPk(storeId, {
                include: [
                    {
                        model: Drink,
                        as: 'ownedDrinks',
                        order: [['id', 'ASC']],
                        where: whereClause,
                        required: false
                    }
                ]
            }),
            Size.findAll({ raw: true }),
            Sugar.findAll({ raw: true }),
            Ice.findAll({ raw: true })
        ])
            .then(function (_a) {
            var _b;
            var storeOwnedDrinks = _a[0], sizes = _a[1], sugars = _a[2], ices = _a[3];
            if (!storeOwnedDrinks)
                throw Object.assign(new Error('該商店不存在!'), { status: 404 });
            var store = storeOwnedDrinks.toJSON();
            var drinksData = ((_b = storeOwnedDrinks === null || storeOwnedDrinks === void 0 ? void 0 : storeOwnedDrinks.ownedDrinks) === null || _b === void 0 ? void 0 : _b.map(function (od) { return ((od === null || od === void 0 ? void 0 : od.toJSON) ? __assign({}, od.toJSON()) : od); })) || [];
            return cb(null, {
                store: store,
                drinks: drinksData,
                sizes: sizes,
                sugars: sugars,
                ices: ices,
                isSearched: "/stores/".concat(req.params.id),
                keyword: keyword,
                find: 'drinks'
            });
        })
            .catch(function (err) { return cb(err); });
    }
};
exports.default = storeServices;
