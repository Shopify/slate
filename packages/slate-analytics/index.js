const rc = require('@shopify/slate-rc');
const {performance} = require('perf_hooks');
const axios = require('axios');
const prompt = require('./prompt');
const packageJson = require('./package.json');

async function init() {
  let config = rc.get() || rc.generate();

  // eslint-disable-next-line no-process-env
  if (process.env.NODE_ENV === 'test') {
    return config;
  }

  // Check if we need to ask for consent
  if (
    typeof config.tracking === 'undefined' ||
    config.trackingVersion < packageJson.trackingVersion
  ) {
    if (typeof config.tracking === 'undefined') {
      // If new user
      const answers = await prompt.forNewConsent();
      config = Object.assign({}, config, answers, {
        tracking: true,
        trackingVersion: packageJson.trackingVersion,
      });
      event('slate-analytics:new-user', config);
    } else {
      // If existing user an needs to update consent
      event('slate-analytics:renew-consent-prompt', config);
      const answers = await prompt.forUpdatedConsent();
      config = Object.assign({}, config, answers, {
        tracking: true,
        trackingVersion: packageJson.trackingVersion,
      });
      event('slate-analytics:renew-consent-true', config);
    }

    rc.update(config);
  }

  return config;
}

function event(name, payload = {}) {
  const config = rc.get();

  if (!config.tracking) {
    return Promise.resolve();
  }

  performance.mark(name);
  const mark = performance.getEntriesByName(name).pop();

  const axiosConfig = {
    params: Object.assign({}, payload, {
      event: name,
      uuid: config.uuid,
      performance: mark,
    }),
  };

  // eslint-disable-next-line no-process-env
  if (process.env.NODE_ENV === 'test') {
    axiosConfig.adaptor = settings => {
      return new Promise(resolve => {
        return resolve({
          data: {},
          status: 200,
          statusText: 'Sucess',
          headers: {},
          settings,
        });
      });
    };
  }

  return axios('https://v.shopify.com/slate/track', axiosConfig);
}

module.exports = {
  init,
  event,
};
