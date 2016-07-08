import path from 'path';
import webpack from 'webpack';
import baseConfig from './webpack.config.base';

export default {
  ...baseConfig,

  devtool: 'source-map',

  entry: ['babel-polyfill', './src/main/app'],

  output: {
    ...baseConfig.output,
    path: path.resolve(__dirname, '../dist/'),
    filename: 'main.js'
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    /* new webpack.BannerPlugin(
      'require("source-map-support").install();',
      { raw: true, entryOnly: false }
    ),*/
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
    'buttercup',
    'electron-devtools-installer',
    'source-map-support'
  ]
};
