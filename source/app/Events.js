(function (module) {
    'use strict';

    var Manager     = require('./manager'),
        Workspace   = require('./workspace'),
        ipc         = require('ipc');

    var manager = new Manager();

    function convertGroups(groups) {
        var parsedGroups = [];

        groups.forEach(function(group) {
            var parsedGroup = group.toObject();
            parsedGroup.groups = convertGroups(group.getGroups());
            parsedGroups.push(parsedGroup);
        });

        return parsedGroups;
    }

    function convertEntries(entries, parentGroup) {
        return entries.map(function(entry) {
            var parsedEntry = entry.toObject();
            parsedEntry.parentID = parentGroup.getID();
            return parsedEntry;
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
            e.returnValue = convertGroups(manager.getGroups());
        });

        // Get a group
        ipc.on('groups.find', function (e, arg) {
            var group = manager.findGroup(arg),
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
            var group = manager.findGroup(arg);
            if (group) {
                group.delete();
                e.returnValue = true;
            } else {
                e.returnValue = false;
            }
        });

        // Get all entries
        ipc.on('entries.all', function (e, arg) {
            var parent = manager.findGroup(arg);
            e.returnValue = convertEntries(parent.getEntries(), parent);
        });

        // Find an entry
        ipc.on('entries.find', function (e, arg) {
            e.returnValue = manager.findEntry(arg).toObject();
        });

        // Edit an entry
        ipc.on('entries.update', function (e, arg) {
            var entry = manager.findEntry(arg.id),
                editable = ['title', 'username', 'password'];

            editable.forEach(function (key) {
                if (arg.changed.hasOwnProperty(key)) {
                    entry.setProperty(key, arg.changed[key]);
                }
            });
            
            e.returnValue = entry.toObject();
        });
    };
})(module);