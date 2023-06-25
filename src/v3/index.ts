import * as FirebaseTokenGenerator from 'firebase-token-generator'
import { Language } from '../models'
import Station from './station'
import Train from './train'
import Wagon from './wagon'
import Auth from './auth'

export default class UZ {
  private lang: Language
  private apiBase: string
  private authClient: Auth

  /**
   * Create a new UZ.
   * @constructor
   * @param {string} [lang=Language.EN] - language
   * @param {string} [auth] - the credentials to authenticate to UzBooking. If auth token is
   *                          not provided requests will be made unauthenticated
   * @param {string} [fcmToken]
   * @param {string} [deviceName]
   * @param {string} [apiBase='https://app.uz.gov.ua'] - the base UzBooking API URL
   */
  constructor(
    lang: Language,
    auth?: any,
    fcmToken?: string,
    deviceName = 'iPhone12.1',
    apiBase = 'https://app.uz.gov.ua',
  ) {
    this.lang = lang
    this.apiBase = apiBase

    let _fcmToken = fcmToken
    if (!_fcmToken) {
      const tokenGenerator = new FirebaseTokenGenerator('<YOUR_FIREBASE_SECRET>')
      _fcmToken = tokenGenerator.createToken({ uid: '1', some: 'arbitrary', data: 'here' })
    }

    this.authClient = new Auth(
      _fcmToken,
      deviceName,
      auth,
      this.lang,
      this.apiBase,
    )
  }

  /**
   * Get Auth wrapper
   * @returns {Auth}
   */
  get Auth() {
    return this.authClient
  }

  /**
   * Create a new Station wrapper
   * @returns {Station}
   */
  get Station() {
    return new Station(this.lang, this.authClient.accessToken, this.apiBase)
  }

  /**
   * Create a new Train wrapper
   * @returns {Train}
   */
  get Train() {
    return new Train(this.lang, this.authClient.accessToken, this.apiBase)
  }

  /**
   * Create a new Wagon wrapper
   * @returns {Wagon}
   */
  get Wagon() {
    return new Wagon(this.lang, this.authClient.accessToken, this.apiBase)
  }
}
