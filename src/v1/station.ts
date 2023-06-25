import Requestable from '../lib/requestable'

export default class Station extends Requestable {
  /**
   * Construct station class.
   * @param {string} [lang] - language
   * @param {auth} [auth] - the credentials to authenticate to UzBoojking. If auth is
   *                                  not provided requests will be made unauthenticated
   * @param {string} [apiBase] - the base UzBooking API URL
   */
  constructor(lang: string, auth: any, apiBase: string) {
    super(lang, auth, apiBase, true)
  }

  /**
   * Find station by name
   * @param {string} stationName - the name of station
   * @param {Function} cb - callback function
   * @returns {Promise} - the promise for the http request
   */
  // tslint:disable-next-line
  public find(
    stationName: string,
    callback?: (error: Error, data?: object, response?: object) => any,
  ) {
    return this.request(
      'POST',
      `train_search/station/?term=${encodeURIComponent(stationName)}/`,
      null,
      'form',
      false,
      callback,
    )
  }
}
