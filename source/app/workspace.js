(function (module) {
    "use strict";

    var Buttercup = require('buttercup');

    module.exports = {
        load: function(datasourcePath, password) {
            var workspace = new Buttercup.Workspace(),
                datasource = new Buttercup.FileDatasource(datasourcePath);

            return datasource.load(password).then(function(archive) {
                workspace
                    .setArchive(archive)
                    .setDatasource(datasource)
                    .setPassword(password);

                return workspace;
            });
        },

        save: function(datasourcePath, password) {
            var archive = new Buttercup.Archive(),
                datasource = new Buttercup.FileDatasource(datasourcePath);

            return datasource.save(archive, password);
        }
    };
})(module);