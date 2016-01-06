"use strict";

import Backbone from 'app/lib/backbone.buttercup';
import Group from 'app/models/group';

export default Backbone.Collection.extend({
    buttercup: new Backbone.Buttercup('groups'),
    model: Group,
    initialize: function(models, options) {
        this.options = options;
    }
});