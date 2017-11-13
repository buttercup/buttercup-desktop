const { resolve } = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const MinifyPlugin = require('babel-minify-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const baseConfig = require('./webpack.config.base');

module.exports = merge(baseConfig, {
  devtool: false,

  entry: {
    main: resolve(__dirname, '../src/renderer/index'),
    fileManager: resolve(__dirname, '../src/renderer/file-manager')
  },

  output: {
    publicPath: '../dist/'
  },

  module: {
    rules: [
      {
        test: /\.global\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true
              }
            },
            {
              loader: 'sass-loader'
            }
          ]
        })
      },

      {
        test: /^((?!\.global).)*\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: true,
                localIdentName: '[name]__[local]___[hash:base64:5]',
                minimize: true
              }
            },
            {
              loader: 'sass-loader'
            }
          ]
        })
      }
    ]
  },

  node: {
    __dirname: false
  },

  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new UglifyJSPlugin({
      parallel: true,
      exclude: /\/node_modules/,
      uglifyOptions: {
        ecma: 8,
        mangle: true,
        compress: {
          sequences: true,
          dead_code: true,
          conditionals: true,
          booleans: true,
          unused: true,
          if_return: true,
          join_vars: true,
          drop_console: true
        },
        output: {
          comments: false,
          beautify: false
        }
      }
    }),
    // new MinifyPlugin({
    //   booleans:	false,
    //   builtIns:	false,
    //   consecutiveAdds: false,
    //   deadcode: false,
    //   evaluate: false,
    //   flipComparisons: false,
    //   guards: false,
    //   infinity: false,
    //   mangle: false,
    //   memberExpressions: false,
    //   mergeVars: false,
    //   numericLiterals: false,
    //   propertyLiterals: false,
    //   regexpConstructors: false,
    //   removeUndefined: false,
    //   replace: false,
    //   simplify: false,
    //   simplifyComparisons: false,
    //   typeConstructors: false,
    //   undefinedToVoid: false,
    //   removeConsole:false,
    //   removeDebugger:false
    // }, {
    //   test: /\.js$/,
    //   sourceMap: false
    // }),
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: true
    })
  ],

  target: 'electron-renderer'
});
