const path = require('path');

// Fetch the contents of Slate's user config once, and only once
global.slateUserConfig = global.slateUserConfig || getSlateUserConfig();

module.exports = class SlateConfig {
  constructor(schema, userConfigOverride) {
    if (typeof schema === 'undefined') {
      throw new TypeError(
        '[slate-config]: A schema object must be provided as the first argument',
      );
    }

    this.userConfigOverride = userConfigOverride;
    this.schema = Object.assign({}, schema);
  }

  get userConfig() {
    return global.slateUserConfig;
  }

  set(key, value, override = false) {
    if (typeof this.schema[key] !== 'undefined' && !override) {
      throw new Error(
        `[slate-config]: A value for '${key}' has already been set. A value can only be set once.`,
      );
    }

    this.schema[key] = value;
  }

  get(key) {
    const userConfig = this.userConfig;
    const value =
      typeof userConfig[key] === 'undefined'
        ? this.schema[key]
        : userConfig[key];

    if (typeof value === 'function') {
      return value(this);
    } else if (typeof value === 'undefined') {
      throw new Error(
        `[slate-config]: A value has not been defined for the key '${key}'`,
      );
    } else {
      return value;
    }
  }
};

function getSlateUserConfig() {
  try {
    return require(path.join(process.cwd(), 'slate.config.js'));
  } catch (error) {
    return {};
  }
}
