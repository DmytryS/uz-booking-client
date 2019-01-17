import axios from 'axios';
import * as debug from 'debug';

const log = debug('uz:requestable');

/**
 * The error structure returned when a network call fails
 */
class ResponseError extends Error {
   path: string;
   response: any;
   status: number;
   request: any;

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
export default class Requestable {
   apiBase: string;
   auth: any;
   METHODS_WITH_NO_BODY = ['GET', 'HEAD', 'DELETE'];

   /**
    * Initialize the http internals.
    * @param {string} [lang] - language
    * @param {Object} [auth] - the credentials to authenticate to Github. If auth is
    *                                  not provided request will be made unauthenticated
    * @param {string} [apiBase] - the base UzBooking API URL
    */
   constructor(lang: string, auth: any, apiBase: string) {
      this.apiBase = lang === 'uk' ? apiBase : `${apiBase}${lang}/`;
      this.auth = auth;
   }

   /**
    * Compute the URL to use to make a request.
    * @private
    * @param {string} path - either a URL relative to the API base or an absolute URL
    * @return {string} - the URL to use
    */
   getURL(path: string) {
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
   getRequestHeaders() {
      let headers: any = {
         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
         'Accept': '*/*',
         'DNT': 1,
         'Host': 'booking.uz.gov.ua',
         'Referer': 'https://booking.uz.gov.ua/ru/',
         'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36',
         'X-Requested-With': 'XMLHttpRequest'
      };

      return headers;
   }

   /**
    * Make a request.
    * @param {string} method - the method for the request (GET, PUT, POST, DELETE)
    * @param {string} path - the path for the request
    * @param {*} [data] - the data to send to the server. For HTTP methods that don't have a body the data
    *                   will be sent as query parameters
    * @param {Requestable.callback} [cb] - the callback for the request
    * @param {boolean} [raw=false] - if the request should be sent as raw. If this is a falsy value then the
    *                              request will be made as JSON
    * @return {Promise} - the Promise for the http request
    */
   public request(method: string, path: string, data: any, cb?: Function, raw = false) {
      const url = this.getURL(path);

      const AcceptHeader = (data || {}).AcceptHeader;
      if (AcceptHeader) {
         delete data.AcceptHeader;
      }
      const headers = this.getRequestHeaders();

      let queryParams = {};

      const shouldUseDataAsParams = data && (typeof data === 'object') && this.methodHasNoBody(method);
      if (shouldUseDataAsParams) {
         queryParams = data;
         data = undefined;
      }

      const config = {
         url: url,
         method: method,
         headers: headers,
         params: queryParams,
         data: data ? this.encodeUrlForm(data) : data,
         responseType: raw ? 'text' : 'json',
      };

      log(`${config.method} to ${config.url}`);
      const requestPromise = axios(config).catch(this.callbackErrorOrThrow(path, cb));

      if (cb) {
         requestPromise.then((response: any) => {
            if (response.data && Object.keys(response.data).length > 0) {
               cb(null, response.data, response);
            } else if (config.method !== 'GET' && Object.keys(response.data).length < 1) {
               cb(null, (response.status < 300), response);
            } else {
               cb(null, response.data, response);
            }
         });
      }

      return requestPromise;
   }

   private callbackErrorOrThrow(path: string, cb?: Function) {
      return function handler(object: any) {
         let error;
         if (object.config && object.response && object.response.status && object.response.statusText) {
            const {response: {status, statusText}, config: {method, url}} = object;
            let message = (`${status} error making request ${method} ${url}: "${statusText}"`);
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

   private encodeUrlForm(form: any): string {
      return Object.keys(form).reduce((p, c) => p + `&${c}=${encodeURIComponent(form[c])}`, '')
   }
}
