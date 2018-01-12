'use strict';

const nock = require('nock');
const http = require('http');

const Client = require('../client');
const {expectRejection} = require('../testHelpers');

function authBasicHeader(user, pass) {
  const credentials = [user, pass].join(':');
  return 'Basic ' + Buffer.from(credentials).toString('base64');
}

describe('Client', () => {
  beforeAll(() => {
    nock.disableNetConnect();
  });
  afterAll(() => {
    nock.enableNetConnect();
  });

  const host = 'example.myshopify.com';
  const apiKey = 'example-api-key';
  const password = 'example-api-password';

  let client;
  let nockScope;

  beforeEach(() => {
    client = new Client({host, apiKey, password});
    client._wait = () => Promise.resolve();

    nockScope = nock(`https://${host}`).matchHeader(
      'Authorization',
      authBasicHeader(apiKey, password)
    );
  });

  describe('error handling', () => {
    it('rejects with a HttpServerError for 5xx errors', async () => {
      nockScope.get('/admin/themes.json').reply(502, '502 Bad Gateway');

      const error = await expectRejection(client.listThemes());

      expect(error).toBeInstanceOf(Client.HttpServerError);
      expect(error.message).toEqual(
        'Server responded with a 502 status\n502 Bad Gateway'
      );
      expect(error.response).toBeInstanceOf(http.IncomingMessage);
      expect(error.responseBody).toEqual('502 Bad Gateway');
    });

    it('rejects with a HttpClientError for 4xx errors', async () => {
      nockScope.get('/admin/themes.json').reply(401, '401 Unauthorized');

      const error = await expectRejection(client.listThemes());

      expect(error).toBeInstanceOf(Client.HttpClientError);
      expect(error.message).toEqual(
        'Server responded with a 401 status\n401 Unauthorized'
      );
      expect(error.response).toBeInstanceOf(http.IncomingMessage);
      expect(error.responseBody).toEqual('401 Unauthorized');
    });
  });

  describe('listThemes()', () => {
    it('returns the list of themes', () => {
      nockScope.get('/admin/themes.json').reply(200, {themes: []});

      return expect(client.listThemes()).resolves.toEqual({themes: []});
    });
  });

  describe('deleteTheme()', () => {
    it('deletes the given theme', () => {
      nockScope.delete('/admin/themes/1.json').reply(200, {});

      return expect(client.deleteTheme(1)).resolves.toEqual({});
    });
  });

  describe('listAssets()', () => {
    it('lists assets for the given theme', () => {
      nockScope.get('/admin/themes/1/assets.json').reply(200, {assets: []});

      return expect(client.listAssets(1)).resolves.toEqual({assets: []});
    });
  });

  describe('getAsset()', () => {
    it('fetches the given asset by key', () => {
      nockScope
        .get('/admin/themes/1/assets.json')
        .query({asset: {key: 'layout/theme.liquid'}})
        .reply(200, {asset: {}});

      return expect(client.getAsset(1, 'layout/theme.liquid')).resolves.toEqual(
        {asset: {}}
      );
    });
  });

  describe('putAsset()', () => {
    it('updates the given asset by key', () => {
      nockScope
        .put('/admin/themes/1/assets.json', {
          asset: {
            key: 'templates/index.liquid',
            attachment: Buffer.from('<h1>Home</h1>').toString('base64'),
          },
        })
        .reply(200, {asset: {}});

      return expect(
        client.putAsset(
          1,
          'templates/index.liquid',
          Buffer.from('<h1>Home</h1>')
        )
      ).resolves.toEqual({asset: {}});
    });
  });

  describe('deleteAsset()', () => {
    it('deletes the given asset by key', () => {
      nockScope
        .delete('/admin/themes/1/assets.json')
        .query({asset: {key: 'templates/index.liquid'}})
        .reply(200, {});

      return expect(
        client.deleteAsset(1, 'templates/index.liquid')
      ).resolves.toEqual({});
    });
  });
});
