import Requestable from '../lib/requestable'

export default class Train extends Requestable {
  /**
   * Construct station class.
   * @param {string} [lang] - language
   * @param {auth} [auth] - the credentials to authenticate to UzBoojking. If auth is
   *                                  not provided requests will be made unauthenticated
   * @param {string} [apiBase] - the base UzBooking API URL
   */
  constructor(lang: string, auth: any, apiBase: string) {
    super(lang, auth, apiBase)
  }

  /**
   * Find train
   * @param {number} from - departure station id
   * @param {number} to - target station id
   * @param {string} date - departure date
   * @param {string} time - departure time
   * @param {Function} callback - callback function
   * @returns {Promise} - the promise for the http request
   */
  public find(
    from: number,
    to: number,
    date: string,
    time: string,
    // tslint:disable-next-line
    callback?: (error: Error, data?: object, response?: object) => any,
  ) {
    return this.request(
      'POST',
      '',
      {
        data: {
          date,
          from_code: from,
          time_from: time,
          time_to: '23:59:59',
          to_code: to,
        },
        tran_id: 'trains',
      },
      'json',
      false,
      callback,
    )
  }

  /**
   * Find train with interchanges
   * @param {number} from - departure station id
   * @param {number} to - target station id
   * @param {string} date - departure date
   * @param {string} time - departure time
   * @param {Function} cb - callback function
   * @returns {Promise} - the promise for the http request
   */
  public findInterchange(
    from: number,
    to: number,
    date: string,
    time: string,
    // tslint:disable-next-line
    callback?: (error: Error, data?: object, response?: object) => any,
  ) {
    return this.request(
      'POST',
      '',
      {
        data: {
          date,
          from_code: from,
          time_from: time,
          time_to: '23:59:59',
          to_code: to,
        },
        tran_id: 'trains_transfer',
      },
      'json',
      false,
      callback,
    )
  }
}
