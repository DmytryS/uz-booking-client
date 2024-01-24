import axios, { AxiosRequestConfig, Method, AxiosResponse } from 'axios'
import * as debug from 'debug'
import { v4 as uuidv4 } from 'uuid'
import * as https from 'https'
const log = debug('uz:requestable')

const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
})

/**
 * The error structure returned when a network call fails
 */
class ResponseError extends Error {
  private path: string
  private response: any
  private status: number
  private request: any

  /**
   * Construct a new ResponseError
   * @param {string} message - an message to return instead of the the default error message
   * @param {string} path - the requested path
   * @param {Object} response - the object returned by Axios
   */
  constructor(message: string, path: string, response: any) {
    super(message)
    this.path = path
    this.request = response.config
    this.response = (response || {}).response || response
    this.status = response.status
  }
}

/**
 * Requestable wraps the logic for making http requests to the API
 */
// tslint:disable-next-line
export default class Requestable {
  public apiBase: string
  public auth: string
  public lang: string
  public METHODS_WITH_NO_BODY = ['GET', 'HEAD', 'DELETE']
  static _clientId: string
  /**
   * Initialize the http internals.
   * @param {string} [lang] - language
   * @param {Object} [auth] - the credentials to authenticate to Github. If auth is
   *                                  not provided request will be made unauthenticated
   * @param {string} [apiBase] - the base UzBooking API URL
   * @param {boolen} [langAsApiPrefix] - use language in url as prefix
   */
  constructor(lang: string, auth: string, apiBase: string, langAsApiPrefix = false) {
    this.apiBase = `${apiBase}${langAsApiPrefix ? lang + '/' : ''}`
    this.lang = lang
    this.auth = auth
  }

  /**
   * Compute the URL to use to make a request.
   * @private
   * @param {string} path - either a URL relative to the API base or an absolute URL
   * @returns {string} - the URL to use
   */
  public getURL(path: string) {
    let url = path

    if (path.indexOf('//') === -1) {
      url = this.apiBase + path
    }

    return url
  }

  /**
   * Compute the headers required for an API request.
   * @private
   * @param {string} dataType
   * @param {string} [accessToken]
   * @returns {Object} - the headers to use in the request
   */
  public getRequestHeaders(dataType, accessToken) {
    const clientId = Requestable._clientId ? Requestable._clientId : "guest";
    const headers: any = {
      Accept: 'application/json',
      'Accept-Encoding': 'gzip, deflate, br',
      // 'Accept-Encoding': 'gzip',
      ...dataType === 'json'
        ? { 'Content-Type': 'application/json; charset=UTF-8' }
        : { 'Content-Type': 'application/x-www-form-urlencoded' },
      ...accessToken
        ? {
          Authorization: accessToken,
        }
        : {},
      DNT: 1,
      // Host: 'booking.uz.gov.ua',
      // Origin: 'https://booking.uz.gov.ua',
      // Referer: 'https://booking.uz.gov.ua/ru/',
      // 'User-Agent':
      //   'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36',
      // 'X-Requested-With': 'XMLHttpRequest'
      'User-Agent': 'UZ/1.11.1 Android/7.1.2 User/'+ clientId, //'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36',
      'x-client-locale': this.lang,
    }

    return headers
  }

  /**
   * Make a request.
   * @param {string} method - the method for the request (GET, PUT, POST, DELETE)
   * @param {string} path - the path for the request
   * @param {*} [data] - the data to send to the server. For HTTP methods that don't have a body the data
   * @param {string} [dataType='json'] - type of data to send
   *                   will be sent as query parameters
   * @param {boolean} [raw=false] - if the request should be sent as raw. If this is a falsy value then the
   * @param {function(error, data, response)} [callback] - the callback for the request
   *                              request will be made as JSON
   * @returns {Promise<AxiosResponse>} - the Promise for the http request
   */
  public request(
    method: Method,
    path: string,
    data: any,
    dataType = 'json',
    raw = false,
    callback?: (error: Error, data?: object, response?: object) => any,
  ): Promise<AxiosResponse> {
    const url = this.getURL(path)

    const AcceptHeader = (data || {}).AcceptHeader
    if (AcceptHeader) {
      delete data.AcceptHeader
    }
    const headers = this.getRequestHeaders(dataType, this.auth)

    let queryParams = {}

    const shouldUseDataAsParams =
      data && typeof data === 'object' && this.methodHasNoBody(method)
    if (shouldUseDataAsParams) {
      queryParams = data
      data = undefined
    }

    let formatedData = null

    if (data) {
      if (dataType === 'json') {
        formatedData = this.formatData(data)
      } else {
        formatedData = this.encodeUrlForm(data)
      }
    }

    const config: AxiosRequestConfig = {
      data: formatedData,
      method,
      headers,
      params: queryParams,
      responseType: raw ? 'text' : 'json',
      url,
    }

    log(`${config.method} to ${config.url}`)

    const requestPromise = axiosInstance(config).catch(
      this.callbackErrorOrThrow(path, callback),
    )

    if (callback) {
      requestPromise.then((response: any) => {
        if (response.data && Object.keys(response.data).length > 0) {
          callback(null, response.data, response)
        } else if (
          config.method !== 'GET' &&
          Object.keys(response.data).length < 1
        ) {
          callback(null, {}, response)
        } else {
          callback(null, response.data, response)
        }
      })
    }

    return requestPromise as Promise<AxiosResponse>
  }

  private callbackErrorOrThrow(
    path: string,
    cb?: (error: Error, data?: object, response?: object) => any,
  ) {
    return function handler(object: any) {
      let error
      if (
        object.config &&
        object.response &&
        object.response.status &&
        object.response.statusText
      ) {
        const {
          response: { status, statusText },
          config: { method, url },
        } = object
        const message = `${status} error making request ${method} ${url}: "${statusText}"`
        error = new ResponseError(message, path, object)
        log(`${message} ${JSON.stringify(object.data)}`)
      } else {
        error = object
      }
      if (cb) {
        log('going to error callback')
        cb(error)
      } else {
        log('throwing error')
        throw error
      }
    }
  }

  private methodHasNoBody(method: string) {
    return this.METHODS_WITH_NO_BODY.indexOf(method) !== -1
  }

  private formatData(data: any): string {
    const currentDate: Date = new Date()
    // tslint:disable-next-line: variable-name
    const datetime_utc =
      currentDate.getUTCFullYear() +
      '-' +
      ('0' + (currentDate.getUTCMonth() + 1)).slice(-2) +
      '-' +
      ('0' + currentDate.getUTCDate()).slice(-2) +
      ' ' +
      ('0' + currentDate.getUTCHours()).slice(-2) +
      ':' +
      ('0' + currentDate.getUTCMinutes()).slice(-2) +
      ':' +
      ('0' + currentDate.getUTCSeconds()).slice(-2)

    const randomId = uuidv4()

    // for (const k of Object.keys(data.data).filter((t) => ['train', 'wagon_type'].includes(t))) {
    //   data.data[k] = encodeURIComponent(data.data[k]);
    // }

    return {
      ...data,
      datetime_utc,
      lang: this.lang,
      os: 1,
      request_id: randomId,
      version: '1.011',
    }
  }

  private encodeUrlForm(form: any): string {
    return Object.keys(form).reduce(
      (p, c) => p + `&${c}=${encodeURIComponent(form[c])}`,
      '',
    )
  }
}
