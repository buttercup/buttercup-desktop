"use strict";

import Backbone from 'backbone';
import BackboneButtercup from 'app/lib/backbone.buttercup';
import Groups from 'app/collections/groups';

export default Backbone.Model.extend({
    buttercup: new Backbone.Buttercup('groups'),
    parse: function(data) {
        if(data.groups.length > 0) {
            this.groups = new Groups(data.groups);
        }
        delete data.groups;
        return data;
    }
});