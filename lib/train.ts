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
   * @param {number} from - departure station id
   * @param {number} to - target station id
   * @param {string} date - departure date
   * @param {string} time - departure time
   * @param {Function} cb - callback function
   * @return {Promise} - the promise for the http request
   */
  public find(
    from: number,
    to: number,
    date: string,
    time: string,
    // tslint:disable-next-line
    cb: Function
  ) {
    return this.request(
      'POST',
      'train_search/',
      {
        date,
        from,
        time,
        to
      },
      cb
    );
  }

  /**
   * Find train with interchanges
   * @param {number} from - departure station id
   * @param {number} to - target station id
   * @param {string} date - departure date
   * @param {string} time - departure time
   * @param {Function} cb - callback function
   * @return {Promise} - the promise for the http request
   */
  public findInterchange(
    from: number,
    to: number,
    date: string,
    time: string,
    // tslint:disable-next-line
    cb: Function
  ) {
    return this.request(
      'POST',
      'train_interchange/',
      {
        date,
        from,
        time,
        to
      },
      cb
    );
  }
}
