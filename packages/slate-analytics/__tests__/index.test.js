jest.mock('../prompt');
jest.mock('axios');

beforeEach(() => jest.resetModules());
afterEach(() => require('mock-fs').restore());

test('has a trackingVersion field in package.json', () => {
  const packageJson = require('../package.json');
  expect(packageJson.trackingVersion).toBeDefined();
});

describe('init()', () => {
  test('returns contents of .slaterc file', async () => {
    const rc = require('@shopify/slate-rc');
    const mock = require('mock-fs');
    const spy = jest.spyOn(rc, 'get');
    const analytics = require('../index');

    mock();
    const config = await analytics.init();

    expect(rc.get).toHaveBeenCalled();
    expect(config.uuid).toBeDefined();

    spy.mockReset();
    spy.mockRestore();
  });

  test("creates a .slaterc file if it doesn't alraedy exist", () => {
    const rc = require('@shopify/slate-rc');
    const mock = require('mock-fs');
    const spy = jest.spyOn(rc, 'generate');
    const analytics = require('../index');

    mock();
    analytics.init();

    expect(rc.generate).toHaveBeenCalled();

    spy.mockReset();
    spy.mockRestore();
  });

  describe('prompt new user for tracking consent and updates .slaterc', () => {
    test('if config.trackingVersion key is undefined (new user)', async () => {
      const rc = require('@shopify/slate-rc');
      const analytics = require('../index');
      const prompt = require('../prompt');
      const mock = require('mock-fs');
      const packageJson = require('../package.json');

      mock();
      prompt.__setNewConsentAnswer({
        tracking: true,
        email: 'tobi@shopify.com',
      });
      const config = await analytics.init();

      expect(prompt.forNewConsent).toHaveBeenCalled();
      expect(config.tracking).toBe(true);
      expect(rc.get().tracking).toBe(true);
      expect(config.email).toBe('tobi@shopify.com');
      expect(rc.get().email).toBe('tobi@shopify.com');
      expect(config.trackingVersion).toBe(packageJson.trackingVersion);
      expect(rc.get().trackingVersion).toBe(packageJson.trackingVersion);
    });

    test('if config.trackingVersion value is defined and but needs to be updated', async () => {
      const rc = require('@shopify/slate-rc');
      const analytics = require('../index');
      const prompt = require('../prompt');
      const mock = require('mock-fs');
      const os = require('os');
      const path = require('path');
      const slatercPath = path.resolve(os.homedir(), '.slaterc');
      const packageJson = require('../package.json');

      mock({
        [slatercPath]: JSON.stringify({
          uuid: '213n21j3n2',
          tracking: false,
          trackingVersion: 0,
        }),
      });
      prompt.__setUpdatedConsentAnswer({tracking: true});

      const config = await analytics.init();

      expect(prompt.forUpdatedConsent).toHaveBeenCalled();
      expect(config.tracking).toBe(true);
      expect(rc.get().tracking).toBe(true);
      expect(config.trackingVersion).toBe(packageJson.trackingVersion);
    });
  });
});

describe('event()', () => {
  test('emits an event to trekkie', async () => {
    const {init, event} = require('../index');
    const axios = require('axios');
    const mock = require('mock-fs');
    const path = require('path');
    const os = require('os');
    const slatercPath = path.resolve(os.homedir(), '.slaterc');

    mock({
      [slatercPath]: JSON.stringify({
        tracking: true,
      }),
    });

    await init();
    await event('test');

    expect(axios).toHaveBeenCalled();
  });

  describe('does not emit an event', () => {
    test('if tracking is disabled', async () => {
      const {init, event} = require('../index');
      const axios = require('axios');
      const mock = require('mock-fs');
      const path = require('path');
      const os = require('os');
      const slatercPath = path.resolve(os.homedir(), '.slaterc');

      mock({
        [slatercPath]: JSON.stringify({
          tracking: false,
        }),
      });

      await init();
      await event('test');

      expect(axios).not.toHaveBeenCalled();
    });
  });

  describe('throws an error', () => {
    test('if slate-analytics was not initialized', async () => {
      const {event} = require('../index');
      const SlateAnalyticsError = require('../slate-analytics-error');

      await expect(() => event('test')).toThrow(SlateAnalyticsError);
    });
  });
});
