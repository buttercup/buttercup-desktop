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
        // Create a group
        ipc.on('entries.create', function (e, arg) {
            try {
                var parentId = arg.collection.options.parentID,
                    group = manager.findGroup(parentId);
                e.returnValue = group.createEntry(arg.attributes.title).toObject();
            } catch (e) {
                e.returnValue = null;
            }
        });

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
                properties = ['title', 'username', 'password'],
                propertiesChanged = arg.changed || {},
                metaChanged = arg._nestedChanges || {};

            // Main Info
            properties.forEach(function (prop) {
                if (propertiesChanged.hasOwnProperty(prop) && propertiesChanged[prop] !== entry.getProperty(prop)) {
                    entry.setProperty(prop, propertiesChanged[prop]);
                }
            });

            // Meta
            for (var metaKey in metaChanged) {
                if (metaChanged.hasOwnProperty(metaKey)) {
                    var key = metaKey.replace("meta.", "").trim(),
                        value = metaChanged[metaKey].trim();
                    if (key.length > 0 && value.length > 0 && value !== entry.getMeta(key)) {
                        entry.setMeta(key, value);
                    }
                }
            }
            
            e.returnValue = entry.toObject();
        });

        // Delete an entry
        ipc.on('entries.delete', function (e, arg) {
            manager.findEntry(arg).delete();
            e.returnValue = true;
        });
    };
})(module);