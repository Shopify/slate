const SETTINGS_SCHEMA_PATH = '../config/settings_schema.json';

function FileListPlugin(version) {
  this.version = version;
}

FileListPlugin.prototype.apply = function(compiler) {
  compiler.plugin('emit', (compilation, callback) => {
    const asset = compilation.assets[SETTINGS_SCHEMA_PATH];
    const schema = JSON.parse(asset._value);

    if (Array.isArray(schema) && typeof schema[0] === 'object') {
      schema[0]['slate-version'] = this.version;
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

    callback();
  });
};

module.exports = FileListPlugin;
