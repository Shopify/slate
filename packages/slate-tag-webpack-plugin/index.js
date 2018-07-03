const SETTINGS_SCHEMA_PATH = '../config/settings_schema.json';
const THEME_INFO_PANEL = 'theme_info';

function FileListPlugin(version) {
  this.version = version;
}

FileListPlugin.prototype.apply = function(compiler) {
  compiler.hooks.emit.tap('Slate Tag Plugin', (compilation) => {
    const asset = compilation.assets[SETTINGS_SCHEMA_PATH].source();
    const schema = JSON.parse(asset);

    const themeInfo = findThemeInfoPanel(schema);

    if (themeInfo) {
      /* eslint-disable-next-line camelcase */
      themeInfo.theme_packaged_with = `@shopify/slate-tools@${this.version}`;
    }

    const jsonString = JSON.stringify(schema);

    compilation.assets[SETTINGS_SCHEMA_PATH] = {
      source() {
        return jsonString;
      },
      size() {
        return jsonString.length;
      },
    };
  });
};

function findThemeInfoPanel(schema) {
  if (!Array.isArray(schema)) {
    return null;
  }

  return schema.find((panel) => {
    return typeof panel === 'object' && panel.name === THEME_INFO_PANEL;
  });
}

module.exports = FileListPlugin;
