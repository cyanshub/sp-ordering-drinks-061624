"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
var oauth_controller_1 = __importDefault(require("../../../controllers/pages/oauth-controller"));
router.get('/auth/google', oauth_controller_1.default.googleSignInPage);
router.get('/auth/google/callback', oauth_controller_1.default.googleSignIn);
exports.default = router;
