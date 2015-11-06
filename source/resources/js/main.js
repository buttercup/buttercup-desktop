"use strict";

// Import Deps
import Layout from 'app/views/layout';
import Backbone from 'backbone';
var ipc = require('ipc');

ipc.send('workspace.connect', {
    path: './myArchive.bcup',
    password: 'sallar'
});

ipc.on('workspace.connected', function() {
    // Create Instances
    window.Layout = new Layout();
    Backbone.history.start();
});
