"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiErrorHandler = exports.generalErrorHandler = void 0;
var generalErrorHandler = function (err, req, res, next) {
    if (err instanceof Error) {
        req.flash('error_messages', "".concat(err.name, ": ").concat(err.message));
    }
    else {
        req.flash('error_messages', "".concat(err));
    }
    res.redirect('back');
    next(err);
};
exports.generalErrorHandler = generalErrorHandler;
var apiErrorHandler = function (err, req, res, next) {
    if (err instanceof Error) {
        res.status(err.status || 500).json({
            status: 'error',
            message: "".concat(err.name, ": ").concat(err.message)
        });
    }
    else {
        res.status(500).json({
            status: 'error',
            message: "".concat(err)
        });
    }
    next(err);
};
exports.apiErrorHandler = apiErrorHandler;
