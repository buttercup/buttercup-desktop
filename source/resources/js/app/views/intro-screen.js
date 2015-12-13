"use strict";

// Import Deps
import _ from 'underscore';
import Backbone from 'backbone';
import Tpl from 'tpl/intro.html!text';

// Electron
const electron = require('electron');
const remote = electron.remote;
const ipc = electron.ipcRenderer;
const BrowserWindow = remote.BrowserWindow;

// Export View
export default Backbone.View.extend({
    el: '.window',

    events: {
        'click [data-filepath]': 'openArchive'
    },

    initialize: function () {
        // Instances
        this.template = _.template(Tpl);

        // Events
        /*ipc.on('workspace.connected', function() {
            // Create Instances
            var win = new BrowserWindow({width: 800, height: 600});
            win.loadURL('file:///Users/sallar/Projects/buttercup/source/public/index.html');
        });*/

        // Render
        this.render();
    },

    render: function () {
        this.$el.html(this.template());
    },

    openArchive: function(e) {
        e.preventDefault();
        var $link = this.$(e.currentTarget);

        ipc.send('workspace.connect', {
            path: $link.data('filepath'),
            password: $link.data('password')
        });
    }
});