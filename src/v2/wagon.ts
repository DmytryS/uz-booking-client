import Requestable from '../lib/requestable';
import { Train } from '../models';

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
   * @param {number} from - departure station id
   * @param {number} to - target station id
   * @param {string} date - departure date
   * @param {string} trainNumber - train number
   * @param {string} wagonType - wagon type
   * @param {Function} cb - callback function
   * @return {Promise} - the promise for the http request
   */
  public list(
    from: number,
    to: number,
    date: string,
    trainNumber: string,
    wagonType: string,
    // tslint:disable-next-line
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
        wagon_type_id: wagonType
      },
      'json',
      cb
    );
  }
}
