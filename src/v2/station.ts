import stations from '../assets/stations/stations'

export default class Station {
  public lang: string
  /**
   * Construct station class.
   * @param {string} [lang] - language
   * @param {auth} [auth] - the credentials to authenticate to UzBoojking. If auth is
   *                                  not provided requests will be made unauthenticated
   * @param {string} [apiBase] - the base UzBooking API URL
   */
  constructor(lang: string, auth: any, apiBase: string) {
    // super(lang, auth, apiBase);
    this.lang = lang
  }

  /**
   * Find station by name
   * @param {string} stationName - the name of station
   * @param {Function} callback - callback function
   * @returns {Promise} - the promise for the http request
   */
  // tslint:disable-next-line
  public find(
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
