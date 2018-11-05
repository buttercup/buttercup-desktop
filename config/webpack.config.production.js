const { resolve } = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const baseConfig = require('./webpack.config.base');

module.exports = merge(baseConfig, {
  devtool: false,

  entry: {
    main: resolve(__dirname, '../src/renderer/index'),
    fileManager: resolve(__dirname, '../src/renderer/file-manager'),
    update: resolve(__dirname, '../src/renderer/update')
  },

  output: {
    publicPath: '../dist/'
  },

  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },

  node: {
    __dirname: false
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
