const { getTemplate } = require('./generate-tags-template');

const getScriptTemplate = ({ htmlWebpackPlugin }) => {
  const { liquidTemplates, liquidLayouts, isDevServer } = htmlWebpackPlugin.options;
  return getTemplate({
    liquidTemplates, liquidLayouts, isDevServer,
    files: htmlWebpackPlugin.files.js,
    genTemplate: ({ src }) => `<script type="text/javascript" src="${src}" async></script>`
  });
}

module.exports = {
  getScriptTemplate
};