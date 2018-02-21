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
    update: resolve(__dirname, '../src/renderer/update')
  },

  devServer: {
    hot: true,
    contentBase: baseConfig.output.path,
    publicPath: '/app',
    port: 3000,
    stats: 'minimal'
  },

  output: {
    publicPath: 'http://localhost:3000/app/'
  },

  module: {
    rules: [
      {
        test: /\.global\.scss$/,
        use: ['style-loader', 'css-loader?sourceMap', 'sass-loader']
      },

      {
        test: /^((?!\.global).)*\.scss$/,
        use: [
          'style-loader',
          'css-loader?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
          'sass-loader'
        ]
      }
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
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

  target: 'electron-renderer'
});
