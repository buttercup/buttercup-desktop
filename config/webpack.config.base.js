const { join } = require('path');

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
        test: /\.(svg|ttf|woff2)$/,
        loader: 'url-loader',
        exclude: /node_modules/
      }
    ]
  },
  output: {
    path: join(__dirname, '../app'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.scss']
  },
  plugins: [

  ],
  externals: [
    'buttercup-importer'
  ]
};
