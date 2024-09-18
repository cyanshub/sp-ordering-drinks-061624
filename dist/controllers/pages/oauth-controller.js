"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var passport_1 = __importDefault(require("../../config/passport"));
var oauthController = {
    googleSignInPage: function (req, res, next) {
        passport_1.default.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
    },
    googleSignIn: function (req, res, next) {
        passport_1.default.authenticate('google', function (err, user, info) {
            if (err) {
                console.error('Error authenticating with Google:', err);
                return res.status(500).send('Error authenticating with Google');
            }
            if (!user) {
                req.flash('error_messages', '登入失敗，請再試一次');
                return res.redirect('/signin');
            }
            req.logIn(user, function (err) {
                if (err) {
                    console.error('Error logging in user:', err);
                    return res.status(500).send('Error logging in user');
                }
                req.flash('success_messages', '登入成功!');
                return res.redirect('/stores');
            });
        })(req, res, next);
    }
};
exports.default = oauthController;
