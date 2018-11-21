import Requestable from './requestable';
import { Train } from './models';
export default class Wagon extends Requestable {
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
     * Find station by name
     * @param {Train} train - the train object
     * @param {string} wagonType - type of wagon
     * @param {Function} cb - callback function
     * @return {Promise} - the promise for the http request
     */
    list(train: Train, wagonType: string, cb: Function) {
        const {
            from: {
                code: from,
                srcDate: date
            },
            to: {
                code: to 
            },
            num: trainNumber
        } = train;

        return this.request(
            'POST',
            'train_wagons/',
            {
                from,
                to,
                date,
                train: trainNumber,
                wagon_type_id: wagonType
            },
            cb
        );
    }
}