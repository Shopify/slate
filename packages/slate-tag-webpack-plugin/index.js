const SETTINGS_SCHEMA_PATH = '../config/settings_schema.json';

function FileListPlugin(version) {
  this.version = version;
}

FileListPlugin.prototype.apply = function(compiler) {
  compiler.hooks.emit.tap('Slate Tag Plugin', (compilation, callback) => {
    const asset = compilation.assets[SETTINGS_SCHEMA_PATH].source();
    const schema = JSON.parse(asset);

    if (Array.isArray(schema) && typeof schema[0] === 'object') {
      schema[0].theme_packaged_with = `@shopify/slate-tools@${this.version}`;
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

module.exports = FileListPlugin;
