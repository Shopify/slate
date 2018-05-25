/* eslint-disable no-process-env */

const uuidGenerator = require('uuid/v4');
const clearConsole = require('react-dev-utils/clearConsole');
const rc = require('@shopify/slate-rc');
const {getUserEmail} = require('@shopify/slate-env');
const axios = require('axios');
const prompt = require('./prompt');
const {validateEmail} = require('./utils');
const packageJson = require('./package.json');

async function init() {
  let config = rc.get() || rc.generate();

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
      let email = getUserEmail();

      if (!validateEmail(email)) {
        const answer = await prompt.forNewConsent();
        email = answer.email;
      }

      config = Object.assign({}, config, {
        email,
        tracking: true,
        trackingVersion: packageJson.trackingVersion,
      });
      rc.update(config);
      event('slate-analytics:new-user', config);
    } else {
      // If existing user an needs to update consent
      event('slate-analytics:renew-consent-prompt', config);
      const answers = await prompt.forUpdatedConsent();
      config = Object.assign({}, config, answers, {
        tracking: true,
        trackingVersion: packageJson.trackingVersion,
      });
      rc.update(config);
      event('slate-analytics:renew-consent-true', config);
    }

    clearConsole();
    console.log(`Thanks for helping improve the Slate development experience!`);
  }

  return config;
}

function event(name, payload = {}) {
  const config = rc.get();

  if (!config.tracking) {
    return Promise.resolve();
  }

  process.env.SLATE_PROCESS_ID =
    process.env.SLATE_PROCESS_ID || uuidGenerator();

  const axiosConfig = {
    params: Object.assign({}, payload, {
      event: name,
      id: process.env.SLATE_PROCESS_ID,
      uuid: config.uuid,
      performance: process.hrtime(),
    }),
  };

  // eslint-disable-next-line no-process-env
  if (process.env.NODE_ENV === 'test') {
    axiosConfig.adaptor = (settings) => {
      return new Promise((resolve) => {
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
