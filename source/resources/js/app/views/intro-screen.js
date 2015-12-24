"use strict";

// Import Deps
import _ from 'underscore';
import Backbone from 'backbone';
import Tpl from 'tpl/intro.html!text';
import Archives from 'app/collections/archives';
import Archive from 'app/models/archive';

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
        'click .cancel': 'togglePasswordForm',
        'submit .password-overlay form': 'loadArchive',
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

    togglePasswordForm: function(id) {
        if (id) {
            this.$('.password-overlay form').data('id', id);
        }
        this.$('.main-screen').toggleClass('hide');
        this.$('.password-overlay').toggleClass('hide');
    },

    loadArchive: function(e) {
        e.preventDefault();
        var $form = this.$(e.currentTarget),
            model = this.collection.get($form.data('id'));

        ipc.send('workspace.connect', {
            path: model.get('path'),
            password: $form.find('input').val()
        });

        // TODO: account for errors
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
            ipc.send('workspace.new', {
                path: filename,
                password: "sallar"
            });
            this.getArchive(filename);
        }
    }
});
