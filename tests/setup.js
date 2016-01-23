(function(module) {

    "use strict";

    var path = require("path");

    var sourcePath = path.join(__dirname + "/", "../source");

    module.exports = {

        WindowManager: require(sourcePath + "/app/WindowManager.js")

    };

})(module);
