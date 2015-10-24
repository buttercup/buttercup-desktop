"use strict";

// Import Deps
import _ from 'underscore';
import Backbone from 'backbone';
import Tpl from 'tpl/sidebar.html!text';
import GroupItemTpl from 'tpl/sidebar-group-item.html!text';
import Groups from 'app/collections/groups';

var SidebarGroupItemView = Backbone.View.extend({
    className: 'nav-group-item',
    tagName: 'span',

    initialize: function () {
        this.template = _.template(GroupItemTpl);
    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

// Export View
export default Backbone.View.extend({
    className: 'pane-sm sidebar',

    initialize: function () {
        this.template = _.template(Tpl);
        this.groups = new Groups();
        this.groups.on('reset', this.addGroups, this);
    },

    render: function () {
        this.$el.html(this.template());
        this.groups.fetch({reset: true});
        return this;
    },

    addGroups: function(collection) {
        _.each(collection.models, (model) => {
            this.addGroup(model);
        });
    },

    addGroup: function(model) {
        var view = new SidebarGroupItemView({model: model});
        this.$('nav').append(view.render().el);
    }

});