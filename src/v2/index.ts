import Station from './station'
import Train from './train'
import Coach from './coach'
import Wagon from './wagon'

export default class UZ {
  private lang: string
  private auth: any
  private apiBase: string

  /**
   * Create a new UZ.
   * @param {string} [lang='en'] - language
   * @param {string} [apiBase='https://195.149.70.31/api/'] - the base UzBooking API URL
   * @param {Object} [auth] - the credentials to authenticate to UzBoojking. If auth is
   *                          not provided requests will be made unauthenticated
   */
  constructor(
    lang: 'en' | 'ru' | 'uk',
    apiBase = 'https://booking.uz.gov.ua/api/', // http://195.149.70.31/api/',
    auth?: any,
  ) {
    this.lang = lang
    this.auth = auth
    this.apiBase = apiBase
  }

  /**
   * Create a new Station wrapper
   * @returns {Station}
   */
  get Station() {
    return new Station(this.lang, this.auth, this.apiBase)
  }

  /**
   * Create a new Train wrapper
   * @returns {Train}
   */
  get Train() {
    return new Train(this.lang, this.auth, this.apiBase)
  }

  /**
   * Create a new Wagon wrapper
   * @returns {Wagon}
   */
  get Wagon() {
    return new Wagon(this.lang, this.auth, this.apiBase)
  }

  /**
   * Create a new Coach wrapper
   * @returns {Coach}
   */
  get Coach() {
    return new Coach(this.lang, this.auth, this.apiBase)
  }
}
