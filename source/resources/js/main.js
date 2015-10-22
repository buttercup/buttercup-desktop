"use strict";

// Import Deps
import Layout from 'app/views/layout';
import Backbone from 'backbone';
var ipc = require('ipc');
//var remote = require('remote');
/*var Manager = remote.require('./manager'),
    manager = new Manager(),
    Workspace = remote.require('./workspace');
*/

ipc.send('workspace.connect', {
    path: './myArchive.bcup',
    password: 'sallar'
});

ipc.on('workspace.connected', function(reply) {
    console.log(reply);
    // Create Instances
    window.Layout = new Layout();
    Backbone.history.start();
});

