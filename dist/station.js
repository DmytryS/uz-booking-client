"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var requestable_1 = require("./requestable");
var Station = /** @class */ (function (_super) {
    __extends(Station, _super);
    /**
     * Construct station class.
     * @param {string} [lang] - language
     * @param {auth} [auth] - the credentials to authenticate to UzBoojking. If auth is
     *                                  not provided requests will be made unauthenticated
     * @param {string} [apiBase] - the base UzBooking API URL
     */
    function Station(lang, auth, apiBase) {
        return _super.call(this, lang, auth, apiBase) || this;
    }
    /**
     * Find station by name
     * @param {string} stationName - the name of station
     * @param {Function} cb - callback function
     * @return {Promise} - the promise for the http request
     */
    Station.prototype.find = function (stationName, cb) {
        return this.request('GET', "train_search/station/?term=" + encodeURIComponent(stationName) + "/", null, cb);
    };
    return Station;
}(requestable_1.default));
exports.default = Station;
