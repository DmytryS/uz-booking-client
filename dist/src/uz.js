"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var station_1 = require("./station");
var train_1 = require("./train");
var coach_1 = require("./coach");
var wagon_1 = require("./wagon");
var UZ = /** @class */ (function () {
    /**
     * Create a new UZ.
     * @param {string} [lang='en'] - language
     * @param {Object} [auth] - the credentials to authenticate to UzBoojking. If auth is
     *                                  not provided requests will be made unauthenticated
     * @param {string} [apiBase='https://booking.uz.gov.ua/'] - the base UzBooking API URL
     */
    function UZ(lang, auth, apiBase) {
        if (apiBase === void 0) { apiBase = 'https://booking.uz.gov.ua'; }
        this.lang = lang;
        this.auth = auth;
        this.apiBase = apiBase;
    }
    Object.defineProperty(UZ.prototype, "Station", {
        /**
         * Create a new Station wrapper
         * @return {Station}
         */
        get: function () {
            return new station_1.default(this.lang, this.auth, this.apiBase);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UZ.prototype, "Train", {
        /**
         * Create a new Train wrapper
         * @return {Train}
         */
        get: function () {
            return new train_1.default(this.lang, this.auth, this.apiBase);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UZ.prototype, "Wagon", {
        /**
         * Create a new Wagon wrapper
         * @return {Wagon}
         */
        get: function () {
            return new wagon_1.default(this.lang, this.auth, this.apiBase);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UZ.prototype, "Coach", {
        /**
         * Create a new Coach wrapper
         * @return {Coach}
         */
        get: function () {
            return new coach_1.default(this.lang, this.auth, this.apiBase);
        },
        enumerable: true,
        configurable: true
    });
    return UZ;
}());
exports.default = UZ;
