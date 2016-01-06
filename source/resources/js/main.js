"use strict";

// Import Deps
import _ from 'underscore';
import Backbone from 'backbone';
import IntroScreen from 'app/views/intro-screen';
import Layout from 'app/views/layout';
import 'app/helpers';

// Create Instances
window.Buttercup = window.Buttercup || {};
Buttercup.Events = _.extend({}, Backbone.Events);

// Decide what to load
if (importScreen === true) {
    Buttercup.IntroScreen = new IntroScreen();
} else {
    Buttercup.Layout = new Layout();
}

// Start histroy process
Backbone.history.start();
