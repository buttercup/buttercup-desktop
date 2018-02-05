const { join } = require('path');
const { NormalModuleReplacementPlugin } = require('webpack');

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        include: [
          join(__dirname, '../src'),
          join(__dirname, '../node_modules/buttercup-generator')
        ]
      },
      {
        test: /\.(svg|png|ttf|woff|woff2)$/,
        use: 'file-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  output: {
    path: join(__dirname, '../app/dist'),
    filename: '[name].bundle.js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.scss'],
    alias: {
      locales: join(__dirname, '../locales')
    }
  },
  plugins: [new NormalModuleReplacementPlugin(/\/iconv-loader/, 'node-noop')],
  externals: ['buttercup-importer', 'zxcvbn', 'dropbox', 'webdav', 'conf']
};
