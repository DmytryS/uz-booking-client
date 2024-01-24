import jwtDecode from 'jwt-decode'

import Requestable from '../lib/requestable'
import { Language } from '../models'

export default class Auth extends Requestable {
  fcmToken: string
  deviceName: string
  phoneNumber: string
  private _accessToken: string
  

  /**
   * Construct auth class.
   * @constructor
   * @param {string} fcmToken
   * @param {string} deviceName
   * @param {auth} [auth] - the credentials to authenticate to UzBoojking. If auth is
   *                                  not provided requests will be made unauthenticated
   * @param {Language} [lang] - language
   * @param {string} [apiBase] - the base UzBooking API URL
   */
  constructor(
    fcmToken: string,
    deviceName: string,
    accessToken: string,
    lang = Language.EN,
    apiBase: string,
  ) {
    super(lang, undefined, apiBase)

    this._accessToken = accessToken.replace('Bearer ', '')
    this.fcmToken = fcmToken
    this.deviceName = deviceName
  }

  /**
   * Send sms
   * @param {string} phoneNumber
   * @param {Function} [callback] - callback function
   * @returns {Promise<void>}
   */
  public async sendSms(
    phoneNumber: string,
    callback?: (error: Error, data?: object, response?: object) => any,
  ) {
    this.phoneNumber = phoneNumber

    await this.request(
      'POST',
      '/api/auth/send-sms',
      {
        phone: this.phoneNumber,
      },
      'json',
      false,
      callback,
    )
  }

  /**
   * Login
   * @param {string} code
   * @param {Function} [callback] - callback function
   * @returns {Promise<{access_token: string, expires_in: number}>}
   */
  public async login(
    code: string,
    callback?: (error: Error, data?: object, response?: object) => any,
  ): Promise<{ access_token: string, expires_in: number }> {
    const authResponse = await this.request(
      'POST',
      '/api/v2/auth/login',
      {
        code,
        device: {
          fcm_token: this.fcmToken,
          name: this.deviceName,
        },
        phone: this.phoneNumber,
      },
      'json',
      false,
    )

    if (authResponse) {
      this._accessToken = authResponse.data?.token?.access_token
      Requestable._clientId = authResponse.data?.profile?.id
      

      if (callback) {
        return callback(undefined, authResponse.data?.token, authResponse)
      }

      return authResponse.data?.token
    }

    return callback(new Error('Failed to login'))
  }

  /**
   * Refresh token
   * @param {Function} [callback] - callback function
   * @returns {Promise<{access_token: string, expires_in: number}>}
   */
  public async refresh(
    callback?: (error: Error, data?: object, response?: object) => any,
  ): Promise<{ access_token: string, expires_in: number }> {
    const refreshResponse = await this.request(
      'POST',
      '/api/v2/auth/refresh',
      {
        device: {
          fcm_token: this.fcmToken,
          name: this.deviceName,
        },
      },
      'json',
      false,
      callback,
    )

    if (refreshResponse) {
      this._accessToken = refreshResponse.data?.token?.access_token

      if (callback) {
        return callback(undefined, refreshResponse?.data?.token, refreshResponse)
      }

      return refreshResponse.data?.token
    }

    return callback(new Error('Failed to refresh token'))
  }

  /**
   * Check if access token expired
   * @returns {Boolean} - the promise for the http request
   */
  public isExpired() {
    const dateNow = new Date()

    if (!this._accessToken) {
      return true
    }

    const decodedToken: { exp: number } = jwtDecode(this._accessToken)

    return decodedToken.exp < dateNow.getTime() / 1000
  }

  /**
   * Get access token
   * @returns {string}
   */
  get accessToken() {
    return `Bearer ${this._accessToken}`
  }
}
