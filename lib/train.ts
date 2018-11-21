import Requestable from './requestable';
import { Station } from './models';
export default class Train extends Requestable {

    /**
     * Construct station class.
     * @param {string} [lang] - language
     * @param {auth} [auth] - the credentials to authenticate to UzBoojking. If auth is
     *                                  not provided requests will be made unauthenticated
     * @param {string} [apiBase] - the base UzBooking API URL
     */
    constructor(lang: string, auth: any, apiBase: string) {
        super(lang, auth, apiBase);
    }

    /**
     * Find train
     * @param {Station} departureStation - departure station object
     * @param {Station} targetStation - target station object
     * @param {string} date - departure date
     * @param {string} time - departure time
     * @param {Function} cb - callback function
     * @return {Promise} - the promise for the http request
     */
    find(departureStation: Station, targetStation: Station, date: string, time: string, cb: Function) {
        return this.request(
            'POST',
            `train_search/`,
            {
                from: departureStation.value,
                to: targetStation.value,
                date,
                time
            },
            cb
        );
    }
}