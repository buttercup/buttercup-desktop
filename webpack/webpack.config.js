require('babel-register');

const env = process.env.NODE_ENV || 'development';
if (env === 'development') {
  module.exports = require('./webpack.config.dev');
}
