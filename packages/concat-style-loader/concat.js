const fs = require('fs');
const path = require('path');

function concatStyles(content, rootPath, loader) {
  const assets = parseImports(content, rootPath, loader).reverse();
  let inlinedAssets = content;

  assets.forEach((asset) => {
    asset.content = concatStyles(asset.content, asset.path);
    inlinedAssets = inlineAsset(inlinedAssets, asset);
  });

  return inlinedAssets;
}

function inlineAsset(content, asset) {
  const startIndex = asset.match.index;
  const endIndex = startIndex + asset.match[0].length;

  return content.slice(0, startIndex) + asset.content + content.slice(endIndex);
}

function parseImports(content, rootPath, loader) {
  const matches = getImportStatements(content);

  return matches.map((match) => {
    const url = getImportURL(match[0]);
    const assetPath = path.resolve(path.dirname(rootPath), url);

    const importedContent = fetchAssetContent(assetPath, loader);

    return {path: assetPath, content: importedContent, match};
  });
}

function fetchAssetContent(assetPath, loader) {
  if (!fs.existsSync(assetPath)) {
    throw new Error(
      `Concat Style Loader Error: Cannot find asset '${assetPath}'`,
    );
  }

  if (loader) {
    loader.addDependency(assetPath);
  }

  return fs.readFileSync(assetPath, 'utf8');
}

function getImportStatements(content, ignoreComments = true) {
  const regex = new RegExp(
    '(?:@import)(?:\\s)(?:url)?(?:(?:(?:\\()(["\'])?(?:[^"\')]+)\\1(?:\\))|(["\'])(?:.+)\\2)(?:[A-Z\\s])*)+(?:;)',
    'gi',
  );
  const matches = [];
  let match;
  while ((match = regex.exec(content))) {
    // If import statement is not followed by a `url(...)`
    if (typeof match[1] === 'undefined') {
      continue;
    }

    match.endIndex = match.index + match[1].length;

    if (matchIsInComment(content, match) && ignoreComments) {
      continue;
    }

    matches.push(match);
  }
  return matches;
}

function matchIsInComment(content, match) {
  // Check comment symbols 1.
  const startBlockComment = content.lastIndexOf('/*', match.index);
  const endBlockComment = content.lastIndexOf('*/', match.index);
  const startLineComment = content.lastIndexOf('//', match.index);
  const endLineComment = content.lastIndexOf('\n', match.index);

  return (
    // Contained within a block comment
    (!(endBlockComment > startBlockComment) && startBlockComment !== -1) ||
    // Contained within a line comment
    (startLineComment > endLineComment && startLineComment !== -1)
  );
}

function getImportURL(statement) {
  const regex = new RegExp(/@import\s+(?:url\()?(.+(?=['")]))(?:\))?.*/gi);
  const match = regex.exec(statement);
  return match[1].replace(/["']/g, '').trim();
}

module.exports = {
  concatStyles,
  getImportStatements,
  matchIsInComment,
  getImportURL,
};
