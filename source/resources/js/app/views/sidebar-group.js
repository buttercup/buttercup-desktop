"use strict";

import _ from 'underscore';
import Backbone from 'backbone';
import SidebarGroupItemView from 'app/views/sidebar-group-item';

export default Backbone.View.extend({
    className: 'nav-group',
    tagName: 'ul',

    initialize: function (options) {
        this.options = options;
        this.collection.on('add', this.addGroup, this);
    },

    render: function () {
        _.each(this.collection.models, (model) => {
            this.addGroup(model);
        });
        return this;
    },

    addGroup: function(model) {
        var view = new SidebarGroupItemView({
            model: model,
            parentView: this.options.parentView
        });
        this.$el.append(view.render().el);
    }
});
