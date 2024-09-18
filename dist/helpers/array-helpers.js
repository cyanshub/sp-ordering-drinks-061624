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
exports.convertToTaiwanTime = exports.getNestedValue = exports.filterUnique = exports.shuffleFisherYates = exports.filterKeyword = void 0;
var moment_timezone_1 = __importDefault(require("moment-timezone"));
var filterKeyword = function (items, keyword) {
    return items.filter(function (item) { return item.name.toLowerCase().includes(keyword.toLowerCase()) || item.fullAddress.toLowerCase().includes(keyword.toLowerCase()); });
};
exports.filterKeyword = filterKeyword;
var shuffleFisherYates = function (items) {
    var _a;
    for (var i = items.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        _a = [items[j], items[i]], items[i] = _a[0], items[j] = _a[1];
    }
    return items;
};
exports.shuffleFisherYates = shuffleFisherYates;
var filterUnique = function (items, keyPath) {
    var seen = new Set();
    return items
        .map(function (item) {
        var uniqueValue = getNestedValue(item, keyPath);
        return uniqueValue !== undefined && seen.has(uniqueValue) ? null : (seen.add(uniqueValue), item);
    })
        .filter(Boolean);
};
exports.filterUnique = filterUnique;
var getNestedValue = function (obj, keys) {
    if (keys.length === 0)
        return obj;
    var firstKey = keys[0], restKeys = keys.slice(1);
    if (obj && typeof obj === 'object' && firstKey in obj) {
        return getNestedValue(obj[firstKey], restKeys);
    }
    return undefined;
};
exports.getNestedValue = getNestedValue;
var convertToTaiwanTime = function (items) {
    return items.map(function (item) {
        var createdAtUTC = item.createdAt;
        var createdAtTaiwan = moment_timezone_1.default.utc(createdAtUTC).tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss');
        return __assign(__assign({}, item), { createdAt: createdAtTaiwan });
    });
};
exports.convertToTaiwanTime = convertToTaiwanTime;
