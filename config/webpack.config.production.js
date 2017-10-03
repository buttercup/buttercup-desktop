const { resolve } = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BabiliPlugin = require('babili-webpack-plugin');
const baseConfig = require('./webpack.config.base');

module.exports = merge(baseConfig, {
  devtool: false,

  entry: {
    main: resolve(__dirname, '../src/renderer/index'),
    fileManager: resolve(__dirname, '../src/renderer/file-manager')
  },

  output: {
    publicPath: '../dist/'
  },

  module: {
    rules: [
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
          loader:
            'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass-loader'
        })
      }
    ]
  },

  node: {
    __dirname: false
  },

  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new BabiliPlugin(),
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: true
    })
  ],

  target: 'electron-renderer'
});
