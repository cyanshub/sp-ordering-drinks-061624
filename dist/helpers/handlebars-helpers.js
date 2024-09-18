"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dayjs_1 = __importDefault(require("dayjs"));
var relativeTime_1 = __importDefault(require("dayjs/plugin/relativeTime"));
dayjs_1.default.extend(relativeTime_1.default);
exports.default = {
    ifCond: function (a, b, options) {
        return a === b ? options.fn(this) : options.inverse(this);
    },
    ifLarger: function (a, b, options) {
        return a > b ? options.fn(this) : options.inverse(this);
    },
    formatNumber: function (number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    relativeTimeFromNow: function (a) { return (0, dayjs_1.default)(a).fromNow(); },
    formatTime: function (a) { return (0, dayjs_1.default)(a).format('YYYY-MM-DD HH:mm'); },
    multiply: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var numbers = args.map(function (arg) { return (typeof arg === 'string' ? parseFloat(arg) : arg); }).filter(function (arg) { return !isNaN(arg); });
        if (numbers.length === 0) {
            return 'Invalid input';
        }
        var init = 1;
        var product = numbers.reduce(function (acc, curr) { return acc * curr; }, init);
        return product.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    sum: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var numbers = args.map(function (arg) { return (typeof arg === 'string' ? parseFloat(arg) : arg); }).filter(function (arg) { return !isNaN(arg); });
        if (numbers.length === 0) {
            return 'Invalid input';
        }
        var init = 0;
        var total = numbers.reduce(function (acc, curr) { return acc + curr; }, init);
        return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    removeString: function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var stringsToRemove = args.filter(function (arg) { return typeof arg === 'string'; });
        stringsToRemove.forEach(function (stringToRemove) {
            name = name.replace(new RegExp(stringToRemove, 'g'), '');
        });
        return name;
    },
    sumPrices: function (carts) {
        var total = 0;
        carts.forEach(function (cart) {
            if (cart.Size.level === '大杯(L)') {
                total += cart.Drink.priceL * cart.amount;
            }
            else {
                total += cart.Drink.priceM * cart.amount;
            }
        });
        return total;
    }
};
