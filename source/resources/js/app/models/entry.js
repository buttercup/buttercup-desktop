"use strict";

import Backbone from 'backbone';
import BackboneButtercup from 'app/lib/backbone.buttercup';

export default Backbone.Model.extend({
    buttercup: new Backbone.Buttercup('entries')
});