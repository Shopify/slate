const fs = require('fs');
const slateConfig = require('@shopify/slate-config');

const config = require('./slate-cssvar-loader.config');

const STYLE_BLOCK_REGEX = /(?:<style>|\{% style %\})([\S\s]*?)(?:<\/style>|\{% endstyle %\})/g;
const CSS_VAR_FUNC_REGEX = /var\(--(.*?)\)/g;
const CSS_VAR_DECL_REGEX = /--(.*?):\s*(\{\{\s*.*?\s*\}\}.*?);/g;

class SlateException {
  constructor(message) {
    this.message = message;
    this.name = 'SlateException';
  }
}

function parseCSSVariables(cssVariablesPaths) {
  const variables = {};
  let styleBlock;
  cssVariablesPaths.forEach(cssVariablesPath => {
    const themeFilePath = slateConfig.resolveTheme(cssVariablesPath);
    const content = fs.readFileSync(themeFilePath, 'utf8');
    while ((styleBlock = STYLE_BLOCK_REGEX.exec(content)) != null) {
      let cssVariableDecl;
      while ((cssVariableDecl = CSS_VAR_DECL_REGEX.exec(styleBlock)) != null) {
        const [, cssVariable, liquidVariable] = cssVariableDecl;
        variables[cssVariable] = liquidVariable;
      }
    }
  });
  return variables;
}

function SlateCSSLoader(source) {
  if (!config.cssVarLoaderEnable) {
    return source;
  }

  const cssVariablesPaths = config.cssVarLoaderLiquidPath;

  cssVariablesPaths.forEach(filePath => this.addDependency(filePath));
  const variables = parseCSSVariables(cssVariablesPaths);

  const result = source.replace(CSS_VAR_FUNC_REGEX, (match, cssVariable) => {
    if (!variables[cssVariable]) {
      throw new SlateException(
        `Liquid variable not found for CSS variable ${cssVariable}`,
      );
    }
    return variables[cssVariable];
  });

  return result;
}

module.exports = SlateCSSLoader;
