/**
 * Requestable wraps the logic for making http requests to the API
 */
export default class Requestable {
    apiBase: string;
    auth: any;
    METHODS_WITH_NO_BODY: string[];
    /**
     * Initialize the http internals.
     * @param {string} [lang] - language
     * @param {Object} [auth] - the credentials to authenticate to Github. If auth is
     *                                  not provided request will be made unauthenticated
     * @param {string} [apiBase] - the base UzBooking API URL
     */
    constructor(lang: string, auth: any, apiBase: string);
    /**
     * Compute the URL to use to make a request.
     * @private
     * @param {string} path - either a URL relative to the API base or an absolute URL
     * @return {string} - the URL to use
     */
    getURL(path: string): string;
    /**
     * Compute the headers required for an API request.
     * @private
     * @param {boolean} raw - if the request should be treated as JSON or as a raw request
     * @param {string} AcceptHeader - the accept header for the request
     * @return {Object} - the headers to use in the request
     */
    getRequestHeaders(): any;
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
    request(method: string, path: string, data: any, cb?: Function, raw?: boolean): Promise<void | import("axios").AxiosResponse<any>>;
    private callbackErrorOrThrow;
    private methodHasNoBody;
    private encodeUrlForm;
}
