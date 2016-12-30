import path from 'path';
import webpack from 'webpack';

export default {
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(svg|ttf|woff|woff2)$/,
        loader: 'url-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: 'style!css'
      }
    ]
  },
  output: {
    path: path.join(__dirname, '../app'),
    filename: 'bundle.js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json', '.scss'],
    packageMains: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main']
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/\/iconv-loader$/, 'node-noop'),
    new webpack.IgnorePlugin(/vertx/)
  ],
  externals: [
    
  ]
};
