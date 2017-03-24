const { join } = require('path');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          join(__dirname, '../src'),
          join(__dirname, '../node_modules/buttercup-generator')
        ]
      },
      {
        test: /\.(svg|ttf|woff|woff2)$/,
        loader: 'url-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }
    ]
  },
  output: {
    path: join(__dirname, '../app/dist'),
    filename: '[name].bundle.js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.scss']
  },
  plugins: [
    new LodashModuleReplacementPlugin()
  ],
  externals: [
    'buttercup-importer', 'zxcvbn', 'dropbox', 'webdav'
  ]
};
