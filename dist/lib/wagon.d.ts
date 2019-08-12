import Requestable from './requestable';
export default class Wagon extends Requestable {
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
     * @param {number} from - departure station id
     * @param {number} to - target station id
     * @param {string} date - departure date
     * @param {string} trainNumber - train number
     * @param {string} wagonType - wagon type
     * @param {Function} cb - callback function
     * @return {Promise} - the promise for the http request
     */
    list(from: number, to: number, date: string, trainNumber: string, wagonType: string, cb: Function): Promise<void | import("axios").AxiosResponse<any>>;
}
