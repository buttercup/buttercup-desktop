const { resolve } = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.base');

module.exports = merge(baseConfig, {
  devtool: 'cheap-module-eval-source-map',

  entry: {
    main: [
      'react-hot-loader/patch',
      resolve(__dirname, '../src/renderer/index')
    ],
    fileManager: resolve(__dirname, '../src/renderer/file-manager'),
    update: resolve(__dirname, '../src/renderer/update'),
    fileHostConnection: resolve(
      __dirname,
      '../src/renderer/file-host-connection'
    )
  },

  devServer: {
    hot: true,
    contentBase: baseConfig.output.path,
    publicPath: '/app',
    port: 3000,
    stats: 'normal'
  },

  output: {
    publicPath: 'http://localhost:3000/app/'
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new webpack.LoaderOptionsPlugin({
      debug: true
    })
  ],

  externals: [],

  node: {
    __dirname: false
  },
  mode: 'development',
  target: 'electron-renderer'
});
