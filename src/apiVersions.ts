import apiV1 from './v1'
import apiV2 from './v2'

export default class UZ {
  private lang: string;
  private auth: any;
  private apiBase: string;

  /**
   * Create a new UZ.
   * @param {string} [lang='en'] - language
   * @param {string} [apiBase='https://195.149.70.31'] - the base UzBooking API URL
   * @param {Object} [auth] - the credentials to authenticate to UzBoojking. If auth is
   *                          not provided requests will be made unauthenticated
   */
  constructor(
    lang: 'en' | 'ru' | 'uk',
    apiBase = 'https://195.149.70.31', // 'https://booking.uz.gov.ua',
    auth?: any
  ) {
    this.lang = lang;
    this.auth = auth;
    this.apiBase = apiBase;
  }

  /**
   * Create a new Station wrapper
   * @return {Station}
   */
  get v1() {
    return new Station(this.lang, this.auth, this.apiBase);
  }

  /**
   * Create a new Train wrapper
   * @return {Train}
   */
  get v2() {
    return new Train(this.lang, this.auth, this.apiBase);
  }
