(function (module) {
    "use strict";

    var Manager     = require('./manager'),
        Workspace   = require('./workspace'),
        ipc         = require('ipc');

    var manager = new Manager();

    module.exports = function () {
        // Connect to workspace
        ipc.on('workspace.connect', function(event, arg) {
            Workspace.load(arg.path, arg.password).then(function (workspace) {
                manager.setWorkspace(workspace);
                event.sender.send('workspace.connected', 'connected');
            });
        });

        // Get all groups
        ipc.on('groups.all', function (e) {
            e.returnValue = manager.getGroups();
        });
    };
})(module);