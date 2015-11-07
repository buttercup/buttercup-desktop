(function (module) {
    "use strict";

    var Manager     = require('./manager'),
        Workspace   = require('./workspace'),
        ipc         = require('ipc');

    var manager = new Manager();

    function findGroup(id, managedGroups) {
        var len = managedGroups.length;

        for (var i = 0; i < len; i += 1) {
            var childs = managedGroups[i].getGroups();

            if (managedGroups[i].getID() === id) {
                return managedGroups[i];
            }
            else if (childs.length > 0) {
                var result = findGroup(id, childs);

                if (result) {
                    return result;
                }
            }
        }

        return false;
    }

    function convertGroups(groups) {
        var parsedGroups = [];

        groups.forEach(function(group) {
            var parsedGroup = group.toObject();
            parsedGroup.groups = convertGroups(group.getGroups());
            parsedGroups.push(parsedGroup);
        });

        return parsedGroups;
    }

    function convertEntries(entries) {
        return entries.map(function(entry) {
            return entry.toObject();
        });
    }

    module.exports = function () {
        // Connect to workspace
        ipc.on('workspace.connect', function(event, arg) {
            Workspace.load(arg.path, arg.password).then(function (workspace) {
                manager.setWorkspace(workspace);
                event.sender.send('workspace.connected', 'connected');
            });
        });

        // Get all groups
        ipc.on('save', function (e) {
            manager.save();
            e.returnValue = true;
        });

        // Get all groups
        ipc.on('groups.all', function (e) {

            var group = findGroup("616abb37-683f-4544-9471-1a5f1aa89d7a", manager.getGroups());
            /*var property = group.createEntry("Google");
            property.setProperty("username", "sharareh");
            property.setProperty("password", "d8s6d7s6w2$&@&");
            manager.save();*/
            console.log(convertEntries(group.getEntries()));


            e.returnValue = convertGroups(manager.getGroups());
        });

        // Get a group
        ipc.on('groups.find', function (e, arg) {
            var group = findGroup(arg, manager.getGroups()),
                converted = false;

            if (group) {
                converted = group.toObject();
                converted.groups = convertGroups(group.getGroups());
            }

            e.returnValue = converted;
        });

        // Create a group
        ipc.on('groups.create', function (e, arg) {
            e.returnValue = manager.createGroup(arg.attributes.title).toObject();
        });

        // Delete a group
        ipc.on('groups.delete', function (e, arg) {
            var group = findGroup(arg, manager.getGroups());
            if (group) {
                group.delete();
                e.returnValue = true;
            } else {
                e.returnValue = false;
            }
        });

        // Get all groups
        ipc.on('entries.all', function (e, arg) {
            var parent = findGroup(arg, manager.getGroups());
            e.returnValue = convertEntries(parent.getEntries());
        });
    };
})(module);