const fs = require('fs');
const uuidGenerator = require('uuid/v4');
const semver = require('semver');
const config = require('./config');
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

function generate(version, uuid) {
  if (semver.valid(version) === null) {
    throw new SlateRcError(
      'Invalid version string used to generate .slaterc file',
    );
  }

  if (typeof uuid === 'string' && uuid.trim() === '') {
    throw new SlateRcError(
      'Invalid UUID string used to generate .slaterc file',
    );
  }

  fs.writeFileSync(
    config.slateRcPath,
    JSON.stringify({
      uuid: uuidGenerator(),
      version,
    }),
  );
}

module.exports = {
  get,
  generate,
};
