const { resolve } = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.base');

module.exports = merge(baseConfig, {
  devtool: false,

  entry: [resolve(__dirname, '../src/main/app')],

  output: {
    path: resolve(__dirname, '../app/dist/'),
    filename: 'app.js'
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],

  target: 'electron-main',

  node: {
    __dirname: false,
    __filename: false
  },

  externals: ['electron-devtools-installer', 'source-map-support']
});
