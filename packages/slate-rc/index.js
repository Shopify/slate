const fs = require('fs');
const uuidGenerator = require('uuid/v4');
const SlateConfig = require('@process-creative/slate-config');
const config = new SlateConfig(require('./slate-rc.schema'));
const SlateRcError = require('./slate-rc-error');

function get() {
  if (!fs.existsSync(config.get('paths.slateRc'))) {
    return null;
  }

  const buffer = fs.readFileSync(config.get('paths.slateRc'));

  if (buffer.toString('utf8') === '') {
    return null;
  }

  try {
    return JSON.parse(buffer);
  } catch (error) {
    throw new SlateRcError(
      `There was an error while JSON parsing ${config.get(
        'paths.slateRc',
      )}. Please make sure file is valid JSON.`,
    );
  }
}

function generate() {
  if (fs.existsSync(config.get('paths.slateRc'))) {
    throw new SlateRcError(
      '.slaterc file already exists. Use the update() method to update its values.',
    );
  }

  const content = {
    uuid: uuidGenerator(),
  };

  fs.writeFileSync(config.get('paths.slateRc'), JSON.stringify(content));

  return content;
}

function update(updates) {
  const content = Object.assign({}, get(), updates);
  fs.writeFileSync(config.get('paths.slateRc'), JSON.stringify(content));
  return content;
}

module.exports = {
  get,
  generate,
  update,
};
