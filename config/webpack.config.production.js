const { resolve } = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const baseConfig = require('./webpack.config.base');

module.exports = {
  ...baseConfig,

  devtool: null,

  entry: [
    'babel-polyfill',
    resolve(__dirname, '../src/renderer/index')
  ],

  output: {
    ...baseConfig.output,
    publicPath: '../app/'
  },

  module: {
    ...baseConfig.module,

    rules: [
      ...baseConfig.module.rules,

      {
        test: /\.global\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: 'css-loader!sass-loader'
        })
      },

      {
        test: /^((?!\.global).)*\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass-loader'
        })
      }
    ]
  },

  plugins: [
    ...baseConfig.plugins,
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true, // eslint-disable-line camelcase
        warnings: false
      }
    }),
    new ExtractTextPlugin({
      filename: 'style.css',
      allChunks: true
    })
  ],

  target: 'electron-renderer'
};
