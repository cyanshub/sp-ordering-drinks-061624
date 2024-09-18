"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.localAvatarHandler = exports.localCoverHandler = void 0;
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var localCoverHandler = function (file) {
    return new Promise(function (resolve, reject) {
        if (!file)
            return resolve(null);
        var uploadCoverDir = path.resolve(__dirname, '../../', 'upload/covers');
        if (!fs.existsSync(uploadCoverDir)) {
            fs.mkdirSync(uploadCoverDir, { recursive: true });
        }
        var filePath = path.join(uploadCoverDir, file.originalname);
        return fs.promises.readFile(file.path)
            .then(function (data) { return fs.promises.writeFile(filePath, data); })
            .then(function () { return resolve("/upload/covers/".concat(file.originalname)); })
            .catch(function (err) { return reject(err); });
    });
};
exports.localCoverHandler = localCoverHandler;
var localAvatarHandler = function (file) {
    return new Promise(function (resolve, reject) {
        if (!file)
            return resolve(null);
        var uploadAvatarDir = path.resolve(__dirname, '../../', 'upload/avatars');
        if (!fs.existsSync(uploadAvatarDir)) {
            fs.mkdirSync(uploadAvatarDir, { recursive: true });
        }
        var filePath = path.join(uploadAvatarDir, file.originalname);
        return fs.promises.readFile(file.path)
            .then(function (data) { return fs.promises.writeFile(filePath, data); })
            .then(function () { return resolve("/upload/avatars/".concat(file.originalname)); })
            .catch(function (err) { return reject(err); });
    });
};
exports.localAvatarHandler = localAvatarHandler;
