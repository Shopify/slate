const path = require('path');

module.exports = {
  // Returns the root directory of the theme
  'paths.theme': process.cwd(),

  // Theme node_modules directory
  'paths.theme.nodeModules': (config) =>
    path.join(config.get('paths.theme'), 'node_modules'),

  // Theme package.json file
  'paths.theme.packageJson': (config) =>
    path.join(config.get('paths.theme'), 'package.json'),

  // Source directory of theme
  'paths.theme.src': (config) => path.join(config.get('paths.theme'), 'src'),

  // Source of theme configuration files
  'paths.theme.src.config': (config) =>
    path.join(config.get('paths.theme.src'), 'config'),

  // Source font directory for theme
  'paths.theme.src.fonts': (config) =>
    path.join(config.get('paths.theme.src'), 'assets', 'fonts'),

  // Source of images directory
  'paths.theme.src.images': (config) =>
    path.join(config.get('paths.theme.src'), 'assets', 'images'),

  // Source of theme liquid layout files
  'paths.theme.src.layouts': (config) =>
    path.join(config.get('paths.theme.src'), 'layout'),

  // Source of translation locales
  'paths.theme.src.locales': (config) =>
    path.join(config.get('paths.theme.src'), 'locales'),

  // Source scripts directory for theme
  'paths.theme.src.scripts': (config) =>
    path.join(config.get('paths.theme.src'), 'assets', 'scripts'),

  // Source snippets directory
  'paths.theme.src.snippets': (config) =>
    path.join(config.get('paths.theme.src'), 'snippets'),

  // Static asset directory for files that statically copied to paths.theme.dist.assets
  'paths.theme.src.static': (config) =>
    path.join(config.get('paths.theme.src'), 'assets', 'static'),

  // Main SVG source directory for theme
  'paths.theme.src.svgs': (config) =>
    path.join(config.get('paths.theme.src'), 'assets', 'svg'),

  // Source liquid template directory
  'paths.theme.src.templates': (config) =>
    path.join(config.get('paths.theme.src'), 'templates'),

  // Source liquid template directory
  'paths.theme.src.templates.customers': (config) =>
    path.join(config.get('paths.theme.src.templates'), 'customers'),

  // Distribution directory of theme
  'paths.theme.dist': (config) => path.join(config.get('paths.theme'), 'dist'),

  // Distribution assets directory
  'paths.theme.dist.assets': (config) =>
    path.join(config.get('paths.theme.dist'), 'assets'),

  // Distribution assets directory
  'paths.theme.dist.config': (config) =>
    path.join(config.get('paths.theme.dist'), 'config'),

  // Distribution snippets directory
  'paths.theme.dist.snippets': (config) =>
    path.join(config.get('paths.theme.dist'), 'snippets'),

  // Distribution snippets directory
  'paths.theme.dist.locales': (config) =>
    path.join(config.get('paths.theme.dist'), 'locales'),

  // Directory for storing all temporary and/or cache files
  'paths.theme.cache': (config) =>
    path.join(config.get('paths.theme'), '.cache'),
};
