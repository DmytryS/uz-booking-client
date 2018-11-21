import Requestable from './requestable';
import { Train, Wagon } from './models';

export default class Coach extends Requestable {
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
     * List coaches in wagon
     * @param {Train} train - the train object
     * @param {Wagon} wagon - the wagon object
     * @param {Function} cb - callback function
     * @return {Promise} - the promise for the http request
     */
    list(train: Train, wagon: Wagon, cb: Function) {
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

        const {
            num: wagon_num,
            type: wagon_type,
            class: wagon_class
        } = wagon;

        return this.request(
            'POST',
            'train_wagon/',
            {
                from,
                to,
                train: trainNumber,
                date,
                wagon_num,
                wagon_type,
                wagon_class
            },
            cb
        );
    }
}