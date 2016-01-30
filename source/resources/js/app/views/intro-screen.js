"use strict";

// Import Deps
import _ from 'underscore';
import Backbone from 'backbone';
import Tpl from 'tpl/intro.html!text';
import Archives from 'app/collections/archives';
import Archive from 'app/models/archive';
import swal from 'sweetalert';

// Electron
const electron = require('electron');
const remote = electron.remote;
const ipc = electron.ipcRenderer;
const dialog = remote.dialog;

// Export View
export default Backbone.View.extend({
    el: '.window',

    events: {
        'click .recent-files [data-id]': 'loadFromRecent',
        'click .archive-open': 'openArchive',
        'click .archive-new': 'newArchive'
    },

    initialize: function () {
        // Instances
        this.template = _.template(Tpl);
        this.collection = new Archives();
        this.collection.on("reset", this.render, this);
        this.collection.on("add", this.render, this);
        this.collection.fetch({reset: true});

        // Options
        this.fileFilters = [{
            name: 'Buttercup Archives',
            extensions: ['bcup']
        }];

        // Render
        this.render();
    },

    render: function () {
        this.$el.html(this.template({
            recent: this.collection.toJSON().reverse()
        }));
    },

    loadFromRecent: function(e) {
        this.togglePasswordForm(this.$(e.currentTarget).data('id'));
    },

    togglePasswordForm: function(id, newArchive) {
        var model = this.collection.get(id),
            action = (newArchive === true) ? 'new' : 'connect';

        swal({
            title: newArchive ? "New Archive" : "Load Buttercup",
            text: newArchive ? "Please choose a safe password:" : "Enter your archive's password:",
            type: "input",
            showCancelButton: true,
            closeOnConfirm: false,
            animation: "pop",
            inputType: "password",
            inputPlaceholder: "Archive's password..."
        }, function(inputValue) {
            if (inputValue === false || inputValue === undefined) {
                return false;
            }

            if (inputValue === "") {
                swal.showInputError("You need to write something!");
                return false;
            }

            ipc.on('workspace.error', function(e, error) {
                swal.showInputError("Invalid password.");
            });

            ipc.send('workspace.' + action, {
                path: model.get('path'),
                password: inputValue
            });
        });
    },

    getArchive: function(path) {
        var archive = false;

        this.collection.each(function(model) {
            if (model.get('path') === path) {
                archive = model;
            }
        });

        if (!archive) {
            archive = new Archive({path: path});
            this.collection.add(archive);
            archive.save();
        }

        return archive;
    },

    openArchive: function(e) {
        e.preventDefault();

        // Select files
        var selectedFiles = dialog.showOpenDialog({
            title: 'Open Existing Archive...',
            properties: ['openFile', 'createDirectory'],
            filters: this.fileFilers
        });

        if (typeof selectedFiles !== "undefined") {
            // Save to recent files
            var archive = this.getArchive(selectedFiles[0]);
            this.togglePasswordForm(archive.id);
        }
    },

    newArchive: function(e) {
        e.preventDefault();

        var filename = dialog.showSaveDialog({
            filters: this.fileFilters
        });

        if (filename && filename.length > 0) {
            var archive = this.getArchive(filename);
            this.togglePasswordForm(archive.id, true);
        }
    }
});
