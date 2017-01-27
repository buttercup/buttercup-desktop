const { resolve } = require('path');
const webpack = require('webpack');
const baseConfig = require('./webpack.config.base');

module.exports = {
  ...baseConfig,

  devtool: false,

  entry: [
    resolve(__dirname, '../src/main/app')
  ],

  output: {
    ...baseConfig.output,
    path: resolve(__dirname, '../app/'),
    filename: 'main.js'
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ],

  target: 'electron-main',

  node: {
    __dirname: false,
    __filename: false
  },

  externals: [
    ...baseConfig.externals,
    'electron-devtools-installer',
    'source-map-support'
  ]
};
