const { resolve } = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const baseConfig = require('./webpack.config.base');

module.exports = merge(baseConfig, {
  devtool: false,

  entry: {
    main: resolve(__dirname, '../src/renderer/index'),
    fileManager: resolve(__dirname, '../src/renderer/file-manager'),
    update: resolve(__dirname, '../src/renderer/update'),
    fileHostConnection: resolve(
      __dirname,
      '../src/renderer/file-host-connection'
    )
  },

  output: {
    publicPath: '../dist/'
  },

  node: {
    __dirname: false
  },

  optimization: {
    minimizer: [
      new TerserPlugin({
        exclude: /\/node_modules/
      })
    ]
  },

  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  ],
  mode: 'production',
  target: 'electron-renderer'
});
