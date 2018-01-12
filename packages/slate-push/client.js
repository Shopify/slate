'use strict';

const http = require('https');
const querystring = require('querystring');

const leakyBucket = require('./leakyBucket');

// https://help.shopify.com/api/getting-started/api-call-limit
const MS_BETWEEN_REQUESTS = 500;

class HttpServerError extends Error {}
class HttpClientError extends Error {}

module.exports = class Client {
  constructor({host, apiKey, password}) {
    this.host = host;
    this.apiKey = apiKey;
    this.password = password;

    this._httpAgent = this._initHttpAgent();
    this._wait = leakyBucket({
      intervalMs: MS_BETWEEN_REQUESTS,
      maxSize: 500,
    });
  }

  shutdown() {
    this._httpAgent.destroy();
  }

  listThemes() {
    return this._request({
      method: 'GET',
      path: '/admin/themes.json',
    });
  }

  deleteTheme(themeId) {
    return this._request({
      method: 'DELETE',
      path: `/admin/themes/${themeId}.json`,
    });
  }

  listAssets(themeId) {
    return this._request({
      method: 'GET',
      path: `/admin/themes/${themeId}/assets.json`,
    });
  }

  getAsset(themeId, assetKey) {
    return this._request({
      method: 'GET',
      path: `/admin/themes/${themeId}/assets.json`,
      query: {
        'asset[key]': assetKey,
      },
    });
  }

  putAsset(themeId, assetKey, buffer) {
    return this._request({
      method: 'PUT',
      path: `/admin/themes/${themeId}/assets.json`,
      body: {
        asset: {
          key: assetKey,
          attachment: buffer.toString('base64'),
        },
      },
    });
  }

  deleteAsset(themeId, assetKey) {
    return this._request({
      method: 'DELETE',
      path: `/admin/themes/${themeId}/assets.json`,
      query: {
        'asset[key]': assetKey,
      },
    });
  }

  _initHttpAgent() {
    return new http.Agent({
      keepAlive: true,
      keepAliveMsecs: 5000,
      maxSockets: 5,
      maxFreeSockets: 5,
    });
  }

  _defaultRequestOptions() {
    return {
      agent: this._httpAgent,
      protocol: 'https:',
      auth: [this.apiKey, this.password].join(':'),
      host: this.host,
      headers: {
        accept: 'application/json',
      },
    };
  }

  _performRequest(options) {
    return new Promise((resolve, reject) => {
      const request = http.request(options, response => {
        response.setEncoding('utf8');
        const responseChunks = [];

        response.on('data', chunk => {
          responseChunks.push(chunk);
        });

        response.on('end', () => {
          const responseBody = responseChunks.join('');
          resolve({response, responseBody});
        });
      });

      request.on('error', err => reject(err));

      if (options.body) request.write(options.body);

      request.end();
    });
  }

  _handleHttpErrors({response, responseBody}) {
    const {statusCode} = response;
    let error;

    if (statusCode >= 500) {
      error = new HttpServerError(
        `Server responded with a ${statusCode} status\n${responseBody}`
      );
    } else if (statusCode >= 400) {
      error = new HttpClientError(
        `Server responded with a ${statusCode} status\n${responseBody}`
      );
    }

    if (error) {
      error.response = response;
      error.responseBody = responseBody;
      throw error;
    }

    return {response, responseBody};
  }

  _parseJSONResponses({response, responseBody}) {
    const contentType = response.headers['content-type'] || '';
    if (contentType.includes('json')) {
      return {response, responseBody: JSON.parse(responseBody)};
    }
    return {response, responseBody};
  }

  _request({method, path, query, body}) {
    const options = Object.assign({}, this._defaultRequestOptions(), {
      method: method,
      path: path,
    });

    if (query) options.path += `?${querystring.stringify(query)}`;

    if (body) {
      options.headers['content-type'] = 'application/json';
      options.body = JSON.stringify(body);
    }

    return this._wait()
      .then(() => this._performRequest(options))
      .then(responseAndBody => this._parseJSONResponses(responseAndBody))
      .then(responseAndBody => this._handleHttpErrors(responseAndBody))
      .then(({responseBody}) => responseBody);
  }
};

module.exports.HttpServerError = HttpServerError;
module.exports.HttpClientError = HttpClientError;
