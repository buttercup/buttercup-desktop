import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import baseConfig from './webpack.config.base';

const extractAssets = new ExtractTextPlugin('style.css');
const extractGlobals = new ExtractTextPlugin('globals.css');

const config = {
  ...baseConfig,

  devtool: null,

  entry: [
    'babel-polyfill',
    path.resolve(__dirname, '../src/renderer/index')
  ],

  output: {
    ...baseConfig.output,
    publicPath: '../app/'
  },

  module: {
    ...baseConfig.module,

    loaders: [
      ...baseConfig.module.loaders,

      {
        test: /\.global\.scss$/,
        loader: extractGlobals.extract(
          'style-loader',
          'css-loader!sass-loader'
        )
      },

      {
        test: /^((?!\.global).)*\.scss$/,
        loader: extractAssets.extract(
          'style-loader',
          'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass-loader'
        )
      }
    ]
  },

  plugins: [
    ...baseConfig.plugins,
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'global.GENTLY': false
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true, // eslint-disable-line camelcase
        warnings: false
      }
    }),
    extractAssets,
    extractGlobals
  ],

  target: 'electron-renderer'
};

export default config;
