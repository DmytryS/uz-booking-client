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
Object.defineProperty(exports, "__esModule", { value: true });
var requestable_1 = require("./requestable");
var Train = /** @class */ (function (_super) {
    __extends(Train, _super);
    /**
     * Construct station class.
     * @param {string} [lang] - language
     * @param {auth} [auth] - the credentials to authenticate to UzBoojking. If auth is
     *                                  not provided requests will be made unauthenticated
     * @param {string} [apiBase] - the base UzBooking API URL
     */
    function Train(lang, auth, apiBase) {
        return _super.call(this, lang, auth, apiBase) || this;
    }
    /**
     * Find train
     * @param {number} from - departure station id
     * @param {number} to - target station id
     * @param {string} date - departure date
     * @param {string} time - departure time
     * @param {Function} cb - callback function
     * @return {Promise} - the promise for the http request
     */
    Train.prototype.find = function (from, to, date, time, 
    // tslint:disable-next-line
    cb) {
        return this.request('POST', 'train_search/', {
            date: date,
            from: from,
            time: time,
            to: to
        }, cb);
    };
    /**
     * Find train with interchanges
     * @param {number} from - departure station id
     * @param {number} to - target station id
     * @param {string} date - departure date
     * @param {string} time - departure time
     * @param {Function} cb - callback function
     * @return {Promise} - the promise for the http request
     */
    Train.prototype.findInterchange = function (from, to, date, time, 
    // tslint:disable-next-line
    cb) {
        return this.request('POST', 'train_interchange/', {
            date: date,
            from: from,
            time: time,
            to: to
        }, cb);
    };
    return Train;
}(requestable_1.default));
exports.default = Train;
