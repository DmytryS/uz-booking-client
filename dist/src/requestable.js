"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var debug = require("debug");
var generator = require("generate-password");
var util_1 = require("util");
var log = debug('uz:requestable');
/**
 * The error structure returned when a network call fails
 */
var ResponseError = /** @class */ (function (_super) {
    __extends(ResponseError, _super);
    /**
     * Construct a new ResponseError
     * @param {string} message - an message to return instead of the the default error message
     * @param {string} path - the requested path
     * @param {Object} response - the object returned by Axios
     */
    function ResponseError(message, path, response) {
        var _this = _super.call(this, message) || this;
        _this.path = path;
        _this.request = response.config;
        _this.response = (response || {}).response || response;
        _this.status = response.status;
        return _this;
    }
    return ResponseError;
}(Error));
/**
 * Requestable wraps the logic for making http requests to the API
 */
// tslint:disable-next-line
var Requestable = /** @class */ (function () {
    /**
     * Initialize the http internals.
     * @param {string} [lang] - language
     * @param {Object} [auth] - the credentials to authenticate to Github. If auth is
     *                                  not provided request will be made unauthenticated
     * @param {string} [apiBase] - the base UzBooking API URL
     */
    function Requestable(lang, auth, apiBase) {
        this.METHODS_WITH_NO_BODY = ['GET', 'HEAD', 'DELETE'];
        this.apiBase = apiBase + "/api";
        this.lang = lang;
        this.auth = auth;
    }
    /**
     * Compute the URL to use to make a request.
     * @private
     * @param {string} path - either a URL relative to the API base or an absolute URL
     * @return {string} - the URL to use
     */
    Requestable.prototype.getURL = function (path) {
        var url = path;
        if (path.indexOf('//') === -1) {
            url = this.apiBase + path;
        }
        return url;
    };
    /**
     * Compute the headers required for an API request.
     * @private
     * @param {boolean} raw - if the request should be treated as JSON or as a raw request
     * @param {string} AcceptHeader - the accept header for the request
     * @return {Object} - the headers to use in the request
     */
    Requestable.prototype.getRequestHeaders = function () {
        var headers = {
            // 'Accept-Encoding': 'gzip',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            // DNT: 1,
            Host: 'booking.uz.gov.ua'
            // Referer: 'https://booking.uz.gov.ua/ru/',
            // 'User-Agent':
            //   'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36',
            // 'X-Requested-With': 'XMLHttpRequest'
            // 'User-Agent': 'Dalvik / 2.1.0(Linux; U; Android 6.0; Android SDK built for x86 Build / MASTER)'
        };
        return headers;
    };
    /**
     * Make a request.
     * @param {string} method - the method for the request (GET, PUT, POST, DELETE)
     * @param {string} path - the path for the request
     * @param {*} [data] - the data to send to the server. For HTTP methods that don't have a body the data
     *                   will be sent as query parameters
     * @param {Requestable.callback} [cb] - the callback for the request
     * @param {boolean} [raw=false] - if the request should be sent as raw. If this is a falsy value then the
     *                              request will be made as JSON
     * @return {Promise} - the Promise for the http request
     */
    Requestable.prototype.request = function (method, path, data, 
    // tslint:disable-next-line
    cb, raw) {
        if (raw === void 0) { raw = false; }
        var url = this.getURL(path);
        var AcceptHeader = (data || {}).AcceptHeader;
        if (AcceptHeader) {
            delete data.AcceptHeader;
        }
        var headers = this.getRequestHeaders();
        var queryParams = {};
        var shouldUseDataAsParams = data && typeof data === 'object' && this.methodHasNoBody(method);
        if (shouldUseDataAsParams) {
            queryParams = data;
            data = undefined;
        }
        var config = {
            data: this.formatData(data),
            headers: headers,
            method: method,
            params: queryParams,
            responseType: raw ? 'text' : 'json',
            url: url
        };
        log(config.method + " to " + config.url);
        console.log("Config: " + util_1.inspect(config, { depth: 4, colors: true }));
        var requestPromise = axios_1.default(config).catch(this.callbackErrorOrThrow(path, cb));
        if (cb) {
            requestPromise.then(function (response) {
                if (response.data && Object.keys(response.data).length > 0) {
                    cb(null, response.data, response);
                }
                else if (config.method !== 'GET' &&
                    Object.keys(response.data).length < 1) {
                    cb(null, response.status < 300, response);
                }
                else {
                    cb(null, response.data, response);
                }
            });
        }
        return requestPromise;
    };
    // tslint:disable-next-line
    Requestable.prototype.callbackErrorOrThrow = function (path, cb) {
        return function handler(object) {
            var error;
            if (object.config &&
                object.response &&
                object.response.status &&
                object.response.statusText) {
                var _a = object.response, status_1 = _a.status, statusText = _a.statusText, _b = object.config, method = _b.method, url = _b.url;
                var message = status_1 + " error making request " + method + " " + url + ": \"" + statusText + "\"";
                error = new ResponseError(message, path, object);
                log(message + " " + JSON.stringify(object.data));
            }
            else {
                error = object;
            }
            if (cb) {
                log('going to error callback');
                cb(error);
            }
            else {
                log('throwing error');
                throw error;
            }
        };
    };
    Requestable.prototype.methodHasNoBody = function (method) {
        return this.METHODS_WITH_NO_BODY.indexOf(method) !== -1;
    };
    Requestable.prototype.formatData = function (data) {
        var currentDate = new Date();
        var datetime_utc = currentDate.getUTCFullYear() + '-' +
            ('0' + (currentDate.getUTCMonth() + 1)).slice(-2) + '-' +
            ('0' + currentDate.getUTCDate()).slice(-2) + ' ' +
            ('0' + currentDate.getUTCHours()).slice(-2) + ':' +
            ('0' + currentDate.getUTCMinutes()).slice(-2) + ':' +
            ('0' + currentDate.getUTCSeconds()).slice(-2);
        var randomId = generator.generate({
            length: 32,
            numbers: true,
            uppercase: false
        });
        return JSON.stringify(__assign({}, data, { datetime_utc: datetime_utc, lang: 'en', os: 1, request_id: randomId, version: '1.011' }));
        // return Object.keys(data).reduce(
        //   (p, c) => p + `&${c}=${encodeURIComponent(data[c])}`,
        //   ''
        // );
    };
    return Requestable;
}());
exports.default = Requestable;
