"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var store_services_1 = __importDefault(require("../../services/store-services"));
var storeController = {
    getStores: function (req, res, next) {
        store_services_1.default.getStores(req, function (err, data) {
            if (err)
                return next(err);
            res.render('stores/stores', data);
        });
    },
    getStore: function (req, res, next) {
        store_services_1.default.getStore(req, function (err, data) {
            if (err)
                next(err);
            res.render('stores/store', data);
        });
    }
};
exports.default = storeController;
