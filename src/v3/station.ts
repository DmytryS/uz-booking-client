import Requestable from '../lib/requestable'
import stations from '../assets/stations/stations'

export default class Station extends Requestable {
  public lang: string

  /**
   * Construct station class.
   * @constructor
   * @param {string} lang - language
   * @param {string} auth
   * @param {string} apiBase - the base UzBooking API URL
   */
  constructor(lang: string, auth: any, apiBase: string) {
    super(lang, auth, apiBase)
    this.lang = lang
  }

  /**
   * Find station by name
   * @param {string} stationName - the name of station
   * @param {string} [stationFromId]
   * @param {Function} [callback] - callback function
   * @returns {Promise} - the promise for the http request
   */
  public async find(
    stationName: string,
    stationFromId?: [string],
    callback?: (error: Error, data?: object, response?: object) => any,
  ) {
    const response = await this.request(
      'GET',
      '/api/stations',
      {
        search: stationName,
        ...stationFromId ? { station_from_id: stationFromId } : {},
      },
      'json',
      false,
      callback,
    )

    return response.data
  }

  /**
   * Find station by name from assets
   * @param {string} stationName - the name of station
   * @param {Function} [callback] - callback function
   * @returns {Promise} - the promise for the http request
   */
  public async findFromAssets(
    stationName: string,
    callback?: (error: Error, data?: object, response?: object) => any,
  ) {
    const filteredStations: any = []

    for (const property in stations) {
      if (Object.prototype.hasOwnProperty.call(stations, property)) {
        if (
          stations[property][this.lang] &&
          stations[property][this.lang].title
            .toLowerCase()
            .startsWith(stationName.toLowerCase())
        ) {
          filteredStations.push({
            title: stations[property][this.lang].title,
            value: property,
          })
        }
      }
    }

    if (callback) {
      return callback(null, { data: filteredStations })
    }

    return Promise.resolve({ data: filteredStations })
  }
}
