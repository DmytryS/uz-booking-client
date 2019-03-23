import Requestable from './requestable';
export default class Coach extends Requestable {
    /**
     * Construct station class.
     * @param {string} [lang] - language
     * @param {auth} [auth] - the credentials to authenticate to UzBoojking. If auth is
     *                                  not provided requests will be made unauthenticated
     * @param {string} [apiBase] - the base UzBooking API URL
     */
    constructor(lang: string, auth: any, apiBase: string);
    /**
     * List coaches in wagon
     * @param {number} from - departure station id
     * @param {number} to - target station id
     * @param {string} date - departure date
     * @param {string} trainNumber - train number
     * @param {number} wagon_num - wagon number
     * @param {string} wagon_type - wagon type
     * @param {string} wagon_class - wagon class
     * @param {Function} cb - callback function
     * @return {Promise} - the promise for the http request
     */
    list(from: number, to: number, date: string, trainNumber: string, wagon_num: number, wagon_type: string, wagon_class: string, cb: Function): Promise<void | import("axios").AxiosResponse<any>>;
}