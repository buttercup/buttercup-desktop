"use strict";

import Backbone from 'backbone';
import BackboneButtercup from 'app/lib/backbone.buttercup';
import Groups from 'app/collections/groups';

export default Backbone.Model.extend({
    buttercup: new Backbone.Buttercup('groups'),

    attributeDefs: {
        Role: "bc_group_role"
    },

    initialize: function(model) {
        if (model && model.groups) {
            this.groups = new Groups(model.groups, {
                parentID: model.id
            });
        }
    },

    defaults: {
        'title': 'Untitled'
    },

    getAttribute: function(attributeName) {
        let attr = this.get("attributes");

        if (attr && attr.hasOwnProperty(attributeName)) {
            return attr[attributeName];
        }

        return undefined;
    },

    isTrash: function() {
        return (this.getAttribute(this.attributeDefs.Role) === "trash");
    }
});
