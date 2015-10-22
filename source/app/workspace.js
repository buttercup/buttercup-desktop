(function (module) {
    "use strict";

    var Buttercup = require('buttercup');

    module.exports = {
        load: function(datasourcePath, password) {
            var workspace = new Buttercup.Workspace();
            var datasource = new Buttercup.FileDatasource(datasourcePath);

            return datasource.load(password).then(function(archive) {
                workspace
                    .setArchive(archive)
                    .setDatasource(datasource)
                    .setPassword(password);

                return workspace;
            });
        }
    };
})(module);