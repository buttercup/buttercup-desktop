import path from 'path';
import webpack from 'webpack';

const GLOBALS = {
  'process.env.NODE_ENV': JSON.stringify('development'),
  '__DEV__': true
};

module.exports = {
  debug: true,
  devtool: 'cheap-module-eval-source-map',
  noInfo: true,
  reload: true,
  entry: [
    'babel-polyfill',
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    './src/frontend/index.js'
  ],
  output: {
    path: './dist/assets/',
    publicPath: '/assets/',
    filename: '[name].dist.js'
  },
  target: 'web',
  plugins: [
    new webpack.DefinePlugin(GLOBALS),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      {test: /\.js$/, include: path.join(__dirname, 'src'), loaders: ['react-hot', 'babel']}
    ]
  }
};
