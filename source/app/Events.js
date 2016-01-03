(function (module) {
    'use strict';

    var Manager         = require('./manager'),
        Workspace       = require('./workspace'),
        path            = require('path'),
        electron        = require('electron'),
        BrowserWindow   = electron.BrowserWindow,
        ipc             = electron.ipcMain;

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

    function loadWorkspace(path, password) {
        return Workspace.load(path, password).then(function (workspace) {
            manager.setWorkspace(workspace);
            //event.sender.send('workspace.connected', 'connected');

            // Create the browser window.
            Buttercup.MainWindow = new BrowserWindow({
                width: 1000,
                height: 700,
                'title-bar-style': 'hidden'
            });
            Buttercup.MainWindow.loadURL(Buttercup.config.publicDir + '/index.html');
            Buttercup.MainWindow.show();
            Buttercup.MainWindow.webContents.openDevTools();

            // Emitted when the window is closed.
            Buttercup.MainWindow.on('closed', function() {
                Buttercup.MainWindow = null;
            });

            // Close intro screen
            Buttercup.IntroScreen.close();
        });
    }

    module.exports = function () {
        // Connect to workspace
        ipc.on('workspace.connect', function(event, arg) {
            loadWorkspace(arg.path, arg.password).catch(function(err) {
                event.sender.send("workspace.error", err.message);
            });
        });

        ipc.on('workspace.new', function(event, arg) {
            Workspace.save(arg.path, arg.password).then(function() {
                loadWorkspace(arg.path, arg.password);
            });
        });

        // Get all groups
        ipc.on('save', function (e) {
            manager.save();
            e.returnValue = true;
        });

        // Get all groups
        ipc.on('groups.all', function (e) {
            console.log(JSON.stringify(convertGroups(manager.getGroups())));
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
            var parent = null,
                group;

            try {
                var parentId = arg.collection.options.parentID;
                parent = manager.findGroup(parentId);
            } catch (e) {}

            if (parent !== null) {
                group = parent.createGroup(arg.attributes.title);
            } else {
                group = manager.createGroup(arg.attributes.title);
            }

            group = group.toObject();
            group.groups = [];
            e.returnValue = group;
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
                metaChanged = arg._nestedChanges || {},
                removedMetaList = arg._previousAttributes.meta,
                entryObject = entry.toObject();

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

            // Removed Meta
            for (var removedMetaKey in entryObject.meta) {
                if (entryObject.meta.hasOwnProperty(removedMetaKey) && !(removedMetaKey in removedMetaList)) {
                    entry.deleteMeta(removedMetaKey);
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
