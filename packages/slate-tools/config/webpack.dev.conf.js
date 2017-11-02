const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const config = require("./index");
const webpackConfig = require("./webpack.base.conf");
const commonExcludes = require("../lib/common-excludes");
const userWebpackConfig = require("../lib/get-user-webpack-config")("dev");

// so that everything is absolute
webpackConfig.output.publicPath = `${config.domain}:${config.port}/`;

// add hot-reload related code to entry chunks
Object.keys(webpackConfig.entry).forEach(name => {
  webpackConfig.entry[name] = [
    path.join(__dirname, "../lib/hot-client.js")
  ].concat(webpackConfig.entry[name]);
});

module.exports = merge(
  webpackConfig,
  {
    devtool: "#eval-source-map",

    module: {
      rules: [
        {
          test: /\.s[ac]ss$/,
          exclude: commonExcludes(),
          use: [
            { loader: "style-loader" },
            { loader: "css-loader" },
            { loader: "sass-loader" }
          ]
        }
      ]
    },

    plugins: [
      new webpack.DefinePlugin({
        "process.env": { NODE_ENV: '"development"' }
      }),

      new webpack.HotModuleReplacementPlugin(),

      new webpack.NoEmitOnErrorsPlugin(),

      new HtmlWebpackPlugin({
        excludeChunks: ["static"],
        filename: "../layout/theme.liquid",
        template: "./layout/theme.liquid",
        inject: true
      })
    ]
  },
  userWebpackConfig
);
