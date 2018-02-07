const fs = require('fs');
const uuidGenerator = require('uuid/v4');
const config = require('./slate-rc.config');
const SlateRcError = require('./slate-rc-error');

function get() {
  if (!fs.existsSync(config.slateRcPath)) {
    return null;
  }

  const buffer = fs.readFileSync(config.slateRcPath);

  if (buffer.toString('utf8') === '') {
    return null;
  }

  try {
    return JSON.parse(buffer);
  } catch (error) {
    throw new SlateRcError(
      `There was an error while JSON parsing ${
        config.slateRcPath
      }. Please make sure file is valid JSON.`,
    );
  }
}

function generate() {
  if (fs.existsSync(config.slateRcPath)) {
    throw new SlateRcError(
      '.slaterc file already exists. Use the update() method to update its values.',
    );
  }

  const content = {
    uuid: uuidGenerator(),
  };

  fs.writeFileSync(config.slateRcPath, JSON.stringify(content));

  return content;
}

function update(updates) {
  const content = Object.assign({}, get(), updates);
  fs.writeFileSync(config.slateRcPath, JSON.stringify(content));
  return content;
}

module.exports = {
  get,
  generate,
  update,
};
