"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
var axios_1 = __importDefault(require("axios"));
var moment_timezone_1 = __importDefault(require("moment-timezone"));
if (process.env.NODE_ENV !== 'production') {
    dotenv_1.default.config();
}
var toggleServer = ((_a = process.env.TOGGLE_RENDER_APP_ALIVE) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === 'true';
var urlServer = process.env.URL_SERVER_RENDER_APP;
var i1 = 1;
var reqServer = function () { return __awaiter(void 0, void 0, void 0, function () {
    var resFromServer, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log("\u5411 ".concat(urlServer, " \u767C\u9001\u8ACB\u6C42\u7684\u6B21\u6578: "), i1++);
                console.log('發送請求時間: ', new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }));
                console.log('');
                return [4, axios_1.default.get(urlServer)];
            case 1:
                resFromServer = _a.sent();
                console.log("".concat(urlServer, ": status code: ").concat(resFromServer.status));
                return [3, 3];
            case 2:
                error_1 = _a.sent();
                console.error("Error: ".concat(error_1.message));
                return [3, 3];
            case 3: return [2];
        }
    });
}); };
var time = 10 * 60 * 1000;
var breakHour = parseInt(process.env.TOGGLE_RENDER_APP_ALIVE_BREAK_HOUR, 10) || 0;
var continueHour = parseInt(process.env.TOGGLE_RENDER_APP_ALIVE_CONTINUE_HOUR, 10) || 8;
var getCurrentHour = function () { return moment_timezone_1.default.tz('Asia/Taipei').hour(); };
var isQuietHours = function () {
    var currentHour = getCurrentHour();
    return breakHour < continueHour
        ? currentHour >= breakHour && currentHour < continueHour
        : currentHour >= breakHour || currentHour < continueHour;
};
var scheduleKeepAliveReq = function () {
    if (toggleServer) {
        !isQuietHours()
            ? reqServer()
            : console.log('目前為暫停服務時間, 故暫停發送請求');
        setInterval(function () {
            !isQuietHours()
                ? reqServer()
                : console.log('目前為暫停服務時間, 故暫停發送請求');
        }, time);
    }
};
exports.default = scheduleKeepAliveReq;
