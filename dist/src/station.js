"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import Requestable from './requestable';
var stations_1 = require("./library/stations");
var Station = /** @class */ (function () {
    /**
     * Construct station class.
     * @param {string} [lang] - language
     * @param {auth} [auth] - the credentials to authenticate to UzBoojking. If auth is
     *                                  not provided requests will be made unauthenticated
     * @param {string} [apiBase] - the base UzBooking API URL
     */
    function Station(lang, auth, apiBase) {
        // super(lang, auth, apiBase);
        this.lang = lang;
    }
    /**
     * Find station by name
     * @param {string} stationName - the name of station
     * @param {Function} cb - callback function
     * @return {Promise} - the promise for the http request
     */
    // tslint:disable-next-line
    Station.prototype.find = function (stationName, cb) {
        var filteredStations = [];
        for (var property in stations_1.default) {
            if (stations_1.default.hasOwnProperty(property)) {
                if (stations_1.default[property][this.lang] &&
                    stations_1.default[property][this.lang].title
                        .toLowerCase()
                        .startsWith(stationName.toLowerCase())) {
                    filteredStations.push({
                        title: stations_1.default[property][this.lang].title,
                        value: property,
                    });
                }
            }
        }
        // console.log();
        return Promise.resolve(filteredStations);
        // return this.request(
        //   'POST',
        //   // `train_search/station/?term=${encodeURIComponent(stationName)}/`,
        //   '',
        //   {
        //     data: {
        //       term: stationName
        //     },
        //     tran_id: 'stations'
        //   },
        //   cb
        // );
    };
    return Station;
}());
exports.default = Station;
