import Requestable from '../lib/requestable';
import { Train, Wagon } from '../models';

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
   * @param {number} from - departure station id
   * @param {number} to - target station id
   * @param {string} date - departure date
   * @param {string} trainNumber - train number
   * @param {number} wagonNum - wagon number
   * @param {string} wagonType - wagon type
   * @param {string} wagonClass - wagon class
   * @param {Function} cb - callback function
   * @return {Promise} - the promise for the http request
   */
  public list(
    from: number,
    to: number,
    date: string,
    trainNumber: string,
    wagonNum: number,
    wagonType: string,
    wagonClass: string,
    //  tslint:disable-next-line
    cb: Function
  ) {
    return this.request(
      'POST',
      '',
      {
        date,
        from,
        to,
        train: trainNumber,
        wagonClass,
        wagonNum,
        wagonType
      },
      'json',
      cb
    );
  }
}
