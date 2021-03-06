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
        while (_) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var lib_1 = require("../lib");
var utils_1 = require("../utils");
var cache_1 = require("../cache");
function imgWizMiddleWare(opts) {
    var _a = Object.assign({ route: "/", staticDir: "/" }, opts), staticDir = _a.staticDir, cacheDir = _a.cacheDir;
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var cached, data, localFilePath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(['png', 'jpg', 'jpeg', 'tiff', 'webp', 'svg'].indexOf(req.path.split('.').pop()) !== -1)) return [3 /*break*/, 5];
                        cached = false, data = null;
                        localFilePath = formatLocalFilePath(req.path.substr(1), req.query);
                        if (!cacheDir) return [3 /*break*/, 2];
                        return [4 /*yield*/, cache_1.getLocalFile(cacheDir, localFilePath)];
                    case 1:
                        data = _a.sent();
                        cached = data !== null;
                        _a.label = 2;
                    case 2:
                        ;
                        if (!(data === null)) return [3 /*break*/, 4];
                        return [4 /*yield*/, lib_1.convertImage({ path: "" + staticDir + req.path }, req.query)];
                    case 3:
                        data = _a.sent();
                        _a.label = 4;
                    case 4:
                        res.set('Cache-Control', 'public, max-age=31557600');
                        res.set('Last-Modified', utils_1.lastModifiedFormat(new Date()));
                        res.status(200).contentType(data.type).end(data.buffer, 'binary');
                        cacheDir && !cached && cache_1.saveLocalFile(cacheDir, localFilePath, data.buffer);
                        return [3 /*break*/, 6];
                    case 5:
                        next();
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
}
exports.default = imgWizMiddleWare;
/**
 * Format image URL with extension (replace query with dash (-))
 * For example: image-name.jpg?h=190&w=200 => image-name-h=190-w=200.jpg
 * @param url
 * @param query: tranfrom query (h, w, ...)
 */
function formatLocalFilePath(url, query) {
    var split = url.split(".");
    var ext = split.pop();
    return "" + split.join("-").replace(/\//g, '-') + Object.keys(query).map(function (k) { return k + query[k]; }).join("-") + "." + ext;
}
