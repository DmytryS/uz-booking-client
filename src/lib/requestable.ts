import axios from 'axios';
import * as debug from 'debug';
import * as generator from 'generate-password';
import { inspect } from 'util';

const log = debug('uz:requestable');

/**
 * The error structure returned when a network call fails
 */
class ResponseError extends Error {
  private path: string;
  private response: any;
  private status: number;
  private request: any;

  /**
   * Construct a new ResponseError
   * @param {string} message - an message to return instead of the the default error message
   * @param {string} path - the requested path
   * @param {Object} response - the object returned by Axios
   */
  constructor(message: string, path: string, response: any) {
    super(message);
    this.path = path;
    this.request = response.config;
    this.response = (response || {}).response || response;
    this.status = response.status;
  }
}

/**
 * Requestable wraps the logic for making http requests to the API
 */
// tslint:disable-next-line
export default class Requestable {
  public apiBase: string;
  public auth: any;
  public lang: string;
  public METHODS_WITH_NO_BODY = ['GET', 'HEAD', 'DELETE'];

  /**
   * Initialize the http internals.
   * @param {string} [lang] - language
   * @param {Object} [auth] - the credentials to authenticate to Github. If auth is
   *                                  not provided request will be made unauthenticated
   * @param {string} [apiBase] - the base UzBooking API URL
   */
  constructor(lang: string, auth: any, apiBase: string) {
    this.apiBase = apiBase;
    this.lang = lang;
    this.auth = auth;
  }

  /**
   * Compute the URL to use to make a request.
   * @private
   * @param {string} path - either a URL relative to the API base or an absolute URL
   * @return {string} - the URL to use
   */
  public getURL(path: string) {
    let url = path;

    if (path.indexOf('//') === -1) {
      url = this.apiBase + path;
    }

    return url;
  }

  /**
   * Compute the headers required for an API request.
   * @private
   * @param {boolean} raw - if the request should be treated as JSON or as a raw request
   * @param {string} AcceptHeader - the accept header for the request
   * @return {Object} - the headers to use in the request
   */
  public getRequestHeaders() {
    const headers: any = {
      // 'Accept-Encoding': 'gzip',
      // 'Content-Type': 'application/x-www-form-urlencoded',
      // DNT: 1,
      Host: 'booking.uz.gov.ua'
      // Referer: 'https://booking.uz.gov.ua/ru/',
      // 'User-Agent':
      //   'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36',
      // 'X-Requested-With': 'XMLHttpRequest'
      // 'User-Agent': 'Dalvik / 2.1.0(Linux; U; Android 6.0; Android SDK built for x86 Build / MASTER)'
    };

    return headers;
  }

  /**
   * Make a request.
   * @param {string} method - the method for the request (GET, PUT, POST, DELETE)
   * @param {string} path - the path for the request
   * @param {*} [data] - the data to send to the server. For HTTP methods that don't have a body the data
   * @param {string} [dataType='json'] - type of data to send
   *                   will be sent as query parameters
   * @param {Requestable.callback} [cb] - the callback for the request
   * @param {boolean} [raw=false] - if the request should be sent as raw. If this is a falsy value then the
   *                              request will be made as JSON
   * @return {Promise} - the Promise for the http request
   */
  public request(
    method: string,
    path: string,
    data: any,
    dataType = 'json',
    // tslint:disable-next-line
    cb?: Function,
    raw = false
  ) {
    const url = this.getURL(path);

    const AcceptHeader = (data || {}).AcceptHeader;
    if (AcceptHeader) {
      delete data.AcceptHeader;
    }
    const headers = this.getRequestHeaders();

    let queryParams = {};

    const shouldUseDataAsParams =
      data && typeof data === 'object' && this.methodHasNoBody(method);
    if (shouldUseDataAsParams) {
      queryParams = data;
      data = undefined;
    }

    let formatedData = null;

    if (data) {
      formatedData =
        dataType === 'json' ? this.formatData(data) : this.encodeUrlForm(data);
    }

    const config = {
      data: formatedData,
      headers,
      method,
      params: queryParams,
      responseType: raw ? 'text' : 'json',
      url
    };

    log(`${config.method} to ${config.url}`);

    const requestPromise = axios(config).catch(
      this.callbackErrorOrThrow(path, cb)
    );

    if (cb) {
      requestPromise.then((response: any) => {
        if (response.data && Object.keys(response.data).length > 0) {
          cb(null, response.data, response);
        } else if (
          config.method !== 'GET' &&
          Object.keys(response.data).length < 1
        ) {
          cb(null, response.status < 300, response);
        } else {
          cb(null, response.data, response);
        }
      });
    }

    return requestPromise;
  }
  // tslint:disable-next-line
  private callbackErrorOrThrow(path: string, cb?: Function) {
    return function handler(object: any) {
      let error;
      if (
        object.config &&
        object.response &&
        object.response.status &&
        object.response.statusText
      ) {
        const {
          response: { status, statusText },
          config: { method, url }
        } = object;
        const message = `${status} error making request ${method} ${url}: "${statusText}"`;
        error = new ResponseError(message, path, object);
        log(`${message} ${JSON.stringify(object.data)}`);
      } else {
        error = object;
      }
      if (cb) {
        log('going to error callback');
        cb(error);
      } else {
        log('throwing error');
        throw error;
      }
    };
  }

  private methodHasNoBody(method: string) {
    return this.METHODS_WITH_NO_BODY.indexOf(method) !== -1;
  }

  private formatData(data: any): string {
    const currentDate: Date = new Date();
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
      ('0' + currentDate.getUTCSeconds()).slice(-2);

    const randomId = generator.generate({
      length: 32,
      numbers: true,
      uppercase: false
    });

    for (const k of data.data) {
      data.data[k] = encodeURIComponent(data.data[k]);
    }

    return {
      ...data,
      datetime_utc,
      lang: this.lang,
      os: 1,
      request_id: randomId,
      version: '1.011'
    };
  }

  private encodeUrlForm(form: any): string {
    return Object.keys(form).reduce(
      (p, c) => p + `&${c}=${encodeURIComponent(form[c])}`,
      ''
    );
  }
}
