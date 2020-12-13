const { getTemplate } = require('./generate-tags-template');

const getStyleTemplate = ({ htmlWebpackPlugin }) => {
  const { liquidTemplates, liquidLayouts, isDevServer } = htmlWebpackPlugin.options;
  return getTemplate({
    liquidTemplates, liquidLayouts, isDevServer,
    files: htmlWebpackPlugin.files.css,
    genTemplate: ({ src }) => `<link rel="stylesheet" href="${src}" type="text/css" />`
  });
}

module.exports = {
  getStyleTemplate
};