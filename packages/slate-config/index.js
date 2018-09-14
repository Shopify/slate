const path = require('path');
const fs = require('fs');

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
    const defaultValue = this.schema[key];
    const userConfigValue = this.userConfig[key];
    let computedDefaultValue;

    if (
      typeof defaultValue === 'undefined' &&
      typeof userConfigValue === 'undefined'
    ) {
      throw new Error(
        `[slate-config]: A value has not been defined for the key '${key}'`,
      );
    }

    if (typeof defaultValue === 'function') {
      computedDefaultValue = defaultValue(this);
    } else {
      computedDefaultValue = defaultValue;
    }

    if (typeof userConfigValue === 'undefined') {
      return computedDefaultValue;
    } else if (typeof userConfigValue === 'function') {
      return userConfigValue(this, computedDefaultValue);
    } else {
      return userConfigValue;
    }
  }
};

function getSlateUserConfig() {
  const slateConfigPath =
    global.slateConfigPath || path.join(process.cwd(), 'slate.config.js');
  if (fs.existsSync(slateConfigPath)) {
    return require(slateConfigPath);
  } else {
    return {};
  }
}
