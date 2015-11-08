"use strict";

// Import Deps
import Layout from 'app/views/layout';
import Backbone from 'backbone';
import _ from 'underscore';
var ipc = require('ipc');

ipc.send('workspace.connect', {
    path: './myArchive.bcup',
    password: 'sallar'
});

ipc.on('workspace.connected', function() {
    // Create Instances
    window.Buttercup = window.Buttercup || {};
    Buttercup.Events = _.extend({}, Backbone.Events);
    Buttercup.Layout = new Layout();

    Backbone.history.start();
});
