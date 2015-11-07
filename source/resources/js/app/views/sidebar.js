"use strict";

// Import Deps
import _ from 'underscore';
import Backbone from 'backbone';
import Tpl from 'tpl/sidebar.html!text';
import GroupItemTpl from 'tpl/sidebar-group-item.html!text';
import Groups from 'app/collections/groups';

var SidebarGroupView = Backbone.View.extend({
    className: 'nav-group',
    tagName: 'ul',

    render: function () {
        _.each(this.collection.models, (model) => {
            this.addGroup(model);
        });
        return this;
    },

    addGroup: function(model) {
        var view = new SidebarGroupItemView({model: model});
        this.$el.append(view.render().el);
    }
});

var SidebarGroupItemView = Backbone.View.extend({
    className: 'nav-group-item',
    tagName: 'li',

    events: {
        'click .clickable': 'handleClick'
    },

    initialize: function () {
        this.template = _.template(GroupItemTpl);
    },

    render: function () {
        // Render
        this.$el.html(this.template(this.model.toJSON()));

        // Render childs
        if (typeof this.model.groups !== "undefined" && this.model.groups.length > 0) {
            var groupView = new SidebarGroupView({
                collection: this.model.groups
            });
            this.$el.append(groupView.render().el);
        }

        return this;
    },

    handleClick: function (e) {
        e.stopPropagation();
        Layout.trigger('groupSelected', this.model);
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
        var groupView = new SidebarGroupView({
            collection: collection
        });
        this.$('nav').append(groupView.render().el);
    }
});