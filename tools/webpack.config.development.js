import path from 'path';
import webpack from 'webpack';
import NpmInstallPlugin from 'npm-install-webpack-plugin';
import baseConfig from './webpack.config.base';

const config = {
  ...baseConfig,

  debug: true,

  devtool: 'cheap-module-eval-source-map',

  entry: [
    'babel-polyfill',
    'webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr',
    path.resolve(__dirname, '../src/renderer/index')
  ],

  output: {
    ...baseConfig.output,
    publicPath: 'http://localhost:3000/dist/'
  },

  module: {
    ...baseConfig.module,
    loaders: [
      ...baseConfig.module.loaders,

      {
        test: /\.global\.scss$/,
        loaders: [
          'style-loader',
          'css-loader?sourceMap',
          'sass-loader'
        ]
      },

      {
        test: /^((?!\.global).)*\.scss$/,
        loaders: [
          'style-loader',
          'css-loader?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
          'sass-loader'
        ]
      }
    ]
  },

  plugins: [
    ...baseConfig.plugins,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new NpmInstallPlugin({
      dev: true,
      peerDependencies: true
    })
  ],

  externals: [
    ...baseConfig.externals
  ],

  target: 'electron-renderer'
};

export default config;
