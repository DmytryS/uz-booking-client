import Requestable from '../lib/requestable'

export default class Wagon extends Requestable {
  /**
   * Construct wagon class.
   * @constructor
   * @param {string} [lang] - language
   * @param {auth} [auth] - the credentials to authenticate to UzBoojking. If auth is
   *                                  not provided requests will be made unauthenticated
   * @param {string} [apiBase] - the base UzBooking API URL
   */
  constructor(lang: string, auth: any, apiBase: string) {
    super(lang, auth, apiBase)
  }

  /**
   * List wagons by type
   * @param {number} tripId
   * @param {string} wagonType - wagon type
   * @param {Function} [callback] - callback function
   * @returns {Promise} - the promise for the http request
   */
  public async list(
    tripId: string,
    wagonType: string,
    // tslint:disable-next-line
    callback?: (error: Error, data?: object, response?: object) => any,
  ) {
    const response = await this.request(
      'GET',
      `/api/v2/trips/${tripId}/wagons-by-class/${wagonType}`,
      null,
      'json',
      false,
      callback,
    )

    return response.data
  }
}
