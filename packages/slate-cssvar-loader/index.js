const fs = require('fs');
const path = require('path');
const SlateConfig = require('@shopify/slate-config');
const config = new SlateConfig(require('./slate-cssvar-loader.schema'));

const STYLE_BLOCK_REGEX = /(?:<style>|\{% style %\})([\S\s]*?)(?:<\/style>|\{% endstyle %\})/g;
const CSS_VAR_FUNC_REGEX = /var\(--(.*?)\)/g;
const CSS_VAR_DECL_REGEX = /--(.*?):\s*(\{\{\s*.*?\s*\}\}.*?);/g;

function parseCSSVariables(cssVariablesPaths) {
  const variables = {};
  let styleBlock;
  cssVariablesPaths.forEach((cssVariablesPath) => {
    const themeFilePath = path.resolve(
      config.get('paths.theme'),
      cssVariablesPath,
    );
    const content = fs.readFileSync(themeFilePath, 'utf8');
    while ((styleBlock = STYLE_BLOCK_REGEX.exec(content)) != null) {
      let cssVariableDecl;
      while ((cssVariableDecl = CSS_VAR_DECL_REGEX.exec(styleBlock)) != null) {
        const [, cssVariable, liquidVariable] = cssVariableDecl;
        variables[cssVariable] = escapeLiquidVariable(liquidVariable);
      }
    }
  });
  return variables;
}

function escapeLiquidVariable(variable) {
  return variable.replace(/"/g, '\\"');
}

function SlateCSSLoader(source) {
  if (!config.get('cssVarLoader.enable')) {
    return source;
  }

  const cssVariablesPaths = config.get('cssVarLoader.liquidPath');

  cssVariablesPaths.forEach((filePath) => this.addDependency(filePath));
  const variables = parseCSSVariables(cssVariablesPaths);

  return source.replace(CSS_VAR_FUNC_REGEX, (match, cssVariable) => {
    if (!variables[cssVariable]) {
      console.warn(
        `Liquid variable not found for CSS variable "${cssVariable}"`,
      );

      return match;
    }

    return variables[cssVariable];
  });
}

module.exports = SlateCSSLoader;
