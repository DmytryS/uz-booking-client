import Station from './station';
import Train from './train';
import Coach from './coach';
import Wagon from './wagon';
export default class UZ {
    private lang;
    private auth;
    private apiBase;
    /**
     * Create a new UZ.
     * @param {string} [lang='en'] - language
     * @param {Object} [auth] - the credentials to authenticate to UzBoojking. If auth is
     *                                  not provided requests will be made unauthenticated
     * @param {string} [apiBase='https://booking.uz.gov.ua/'] - the base UzBooking API URL
     */
    constructor(lang: 'en' | 'ru' | 'uk', auth?: any, apiBase?: string);
    /**
     * Create a new Station wrapper
     * @return {Station}
     */
    readonly Station: Station;
    /**
     * Create a new Train wrapper
     * @return {Train}
     */
    readonly Train: Train;
    /**
     * Create a new Wagon wrapper
     * @return {Wagon}
     */
    readonly Wagon: Wagon;
    /**
     * Create a new Coach wrapper
     * @return {Coach}
     */
    readonly Coach: Coach;
}
