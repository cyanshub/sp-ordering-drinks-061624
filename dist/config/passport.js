"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var User = require('../models').User;
var passport_1 = __importDefault(require("passport"));
var passport_local_1 = require("passport-local");
var passport_google_oauth20_1 = require("passport-google-oauth20");
var passport_jwt_1 = require("passport-jwt");
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var dotenv_1 = __importDefault(require("dotenv"));
if (process.env.NODE_ENV !== 'production') {
    dotenv_1.default.config();
}
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, cb) {
    User.findOne({ where: { email: email } })
        .then(function (user) {
        if (!user)
            return cb(null, false, { message: '帳號或密碼輸入錯誤!' });
        return bcryptjs_1.default.compare(password, user.password).then(function (res) {
            if (!res)
                return cb(null, false, { message: '帳號或密碼輸入錯誤!' });
            return cb(null, user);
        });
    })
        .catch(function (err) { return cb(err); });
}));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, function (accessToken, refreshToken, profile, cb) {
    var _a;
    var email = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value;
    var name = profile.displayName;
    if (!email) {
        return cb(new Error('No email found in Google profile'));
    }
    User.findOne({ where: { email: email }, attributes: ['id', 'name', 'email'], raw: true })
        .then(function (user) {
        if (user)
            return cb(null, user);
        var randomPwd = Math.random().toString(36).slice(-8);
        return bcryptjs_1.default
            .hash(randomPwd, 10)
            .then(function (hash) { return User.create({ name: name, email: email, password: hash }); })
            .then(function (user) { return cb(null, { id: user.id, name: user.name, email: user.email }); });
    })
        .catch(function (err) { return cb(err); });
}));
passport_1.default.serializeUser(function (user, cb) { return cb(null, user.id); });
passport_1.default.deserializeUser(function (id, cb) {
    User.findByPk(id, { attributes: { exclude: ['password'] } })
        .then(function (user) { return cb(null, user === null || user === void 0 ? void 0 : user.toJSON()); })
        .catch(function (err) { return cb(err); });
});
var jwtOptions = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};
passport_1.default.use(new passport_jwt_1.Strategy(jwtOptions, function (jwtPayload, cb) {
    try {
        cb(null, jwtPayload);
    }
    catch (err) {
        cb(err);
    }
}));
exports.default = passport_1.default;
