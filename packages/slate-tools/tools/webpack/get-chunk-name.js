const crypto = require('crypto');

module.exports = function(module, chunks, cacheGroup) {
  let containsLayout = false;
  const names = chunks
    .map((chunk) => {
      if (chunk.name.includes('layout.')) {
        containsLayout = true;
      }
      return chunk.name;
    })
    .filter(
      (name) => !containsLayout || (containsLayout && name.includes('layout.')),
    );

  if (!names.every(Boolean)) return;

  names.sort();
  let name =
    (cacheGroup && cacheGroup !== 'default' ? `${cacheGroup}@` : '') +
    names.join('@');

  // Filenames and paths can't be too long otherwise an
  // ENAMETOOLONG error is raised. If the generated name is too
  // long, it is truncated and a hash is appended. The limit has
  // been set to 100 to prevent `[name].[chunkhash].[ext]` from
  // generating a 256+ character string.
  if (name.length > 256) {
    name = `${name.slice(0, 240)}~${hashFilename(name)}`;
  }

  /* eslint-disable-next-line consistent-return */
  return name;
};

function hashFilename(name) {
  return crypto
    .createHash('md4')
    .update(name)
    .digest('hex')
    .slice(0, 8);
}
