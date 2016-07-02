'use strict';

const path = require('path');

const sourcePath = path.join(__dirname, '../source');

module.exports = {
  WindowManager: require(path.join(sourcePath, '/app/WindowManager.js'))
};
