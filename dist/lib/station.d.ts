import Requestable from './requestable';
export default class Station extends Requestable {
    /**
     * Construct station class.
     * @param {string} [lang] - language
     * @param {auth} [auth] - the credentials to authenticate to UzBoojking. If auth is
     *                                  not provided requests will be made unauthenticated
     * @param {string} [apiBase] - the base UzBooking API URL
     */
    constructor(lang: string, auth: any, apiBase: string);
    /**
     * Find station by name
     * @param {string} stationName - the name of station
     * @param {Function} cb - callback function
     * @return {Promise} - the promise for the http request
     */
    find(stationName: string, cb: Function): Promise<void | import("axios").AxiosResponse<any>>;
}
