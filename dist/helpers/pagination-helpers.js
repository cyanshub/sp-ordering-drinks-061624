"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagination = exports.getOffset = void 0;
var getOffset = function (limit, page) {
    if (limit === void 0) { limit = 10; }
    if (page === void 0) { page = 1; }
    return (page - 1) * limit;
};
exports.getOffset = getOffset;
var getPagination = function (limit, page, total) {
    if (limit === void 0) { limit = 10; }
    if (page === void 0) { page = 1; }
    if (total === void 0) { total = 100; }
    var totalPage = Math.ceil(total / limit);
    var pages = Array.from({ length: totalPage }, function (_, index) { return index + 1; });
    var currentPage = page < 1 ? 1 : page < totalPage ? page : totalPage;
    var prev = currentPage - 1 < 1 ? 1 : currentPage - 1;
    var next = currentPage + 1 > totalPage ? totalPage : currentPage + 1;
    var setCounts = 2;
    var initialPages = Array.from({ length: setCounts }, function (_, i) { return i + 1; }).filter(function (page) { return page <= totalPage; });
    var finalPages = Array.from({ length: setCounts }, function (_, i) { return i + 1 - setCounts + totalPage; }).filter(function (page) { return page > setCounts; });
    var visiblePages = [];
    var visibleCounts = 2;
    var range = {
        start: Math.max(setCounts + 1, currentPage - visibleCounts),
        end: Math.min(totalPage - setCounts, currentPage + visibleCounts)
    };
    for (var i = range.start; i <= range.end; i++) {
        visiblePages.push(i);
    }
    var hasPrevEllipsis = range.start > setCounts + 1;
    var hasNextEllipsis = range.end < totalPage - setCounts;
    return {
        pages: pages,
        totalPage: totalPage,
        currentPage: currentPage,
        prev: prev,
        next: next,
        initialPages: initialPages,
        visiblePages: visiblePages,
        finalPages: finalPages,
        hasPrevEllipsis: hasPrevEllipsis,
        hasNextEllipsis: hasNextEllipsis
    };
};
exports.getPagination = getPagination;
