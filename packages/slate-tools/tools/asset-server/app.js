const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const corsMiddleware = require('cors');
const express = require('express');

const {isHotUpdateFile} = require('../utilities');

module.exports = class App {
  constructor(compiler) {
    const app = express();

    app.webpackDevMiddleware = webpackDevMiddleware(compiler, {
      logLevel: 'silent',
      reload: true,
      writeToDisk: (filePath) => {
        return !isHotUpdateFile(filePath);
      },
    });
    app.webpackHotMiddleware = webpackHotMiddleware(compiler, {
      log: false,
    });

    app.use(corsMiddleware());
    app.use(app.webpackDevMiddleware);
    app.use(app.webpackHotMiddleware);

    return app;
  }
};
