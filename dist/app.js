"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var express_handlebars_1 = __importDefault(require("express-handlebars"));
var dotenv_1 = __importDefault(require("dotenv"));
var path_1 = __importDefault(require("path"));
var method_override_1 = __importDefault(require("method-override"));
var handlebars_helpers_1 = __importDefault(require("./helpers/handlebars-helpers"));
var connect_flash_1 = __importDefault(require("connect-flash"));
var express_session_1 = __importDefault(require("express-session"));
var routes_1 = require("./routes");
var passport_1 = __importDefault(require("./config/passport"));
var auth_helpers_1 = require("./helpers/auth-helpers");
var req_helpers_1 = __importDefault(require("./helpers/req-helpers"));
if (process.env.NODE_ENV !== 'production') {
    dotenv_1.default.config();
}
var app = (0, express_1.default)();
var port = process.env.PORT || 3002;
app.engine('hbs', (0, express_handlebars_1.default)({
    extname: '.hbs',
    helpers: handlebars_helpers_1.default
}));
app.set('view engine', 'hbs');
app.use('/', express_1.default.static(path_1.default.join(__dirname, '..', 'public')));
app.use('/upload', express_1.default.static(path_1.default.join(__dirname, '..', 'upload')));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, method_override_1.default)('_method'));
app.use((0, connect_flash_1.default)());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(function (req, res, next) {
    res.locals.success_messages = req.flash('success_messages');
    res.locals.error_messages = req.flash('error_messages');
    res.locals.userAuth = (0, auth_helpers_1.getUser)(req);
    next();
});
app.use('/api', routes_1.apis);
app.use(routes_1.pages);
(0, req_helpers_1.default)();
app.listen(port, function () {
    console.info("Ordering drinks application listening on port: http://localhost:".concat(port));
});
