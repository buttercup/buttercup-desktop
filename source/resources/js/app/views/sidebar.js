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

    initialize: function (options) {
        this.options = options;
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

var SidebarGroupItemView = Backbone.View.extend({
    tagName: 'li',

    events: {
        'click .nav-group-item': 'handleClick'
    },

    initialize: function (options) {
        this.template = _.template(GroupItemTpl);
        this.options = options;
    },

    render: function () {
        // Render
        this.$el.html(this.template(this.model.toJSON()));

        // Render childs
        if (typeof this.model.groups !== "undefined" && this.model.groups.length > 0) {
            var groupView = new SidebarGroupView({
                collection: this.model.groups,
                parentView: this.options.parentView
            });
            this.$el.append(groupView.render().el);
        }

        return this;
    },

    handleClick: function (e) {
        e.stopPropagation();
        //this.options.parentView.$('.nav-group-item').removeClass('active');
        //this.$(e.target).addClass('active');
        Buttercup.Events.trigger('groupSelected', this.model);
    }
});

// Export View
export default Backbone.View.extend({
    className: 'pane-sm sidebar',

    initialize: function () {
        this.template = _.template(Tpl);
        this.groups = new Groups();
        this.groups.on('reset', this.addGroups, this);
        Buttercup.Events.on('groupSelected', this.handleSelectedGroup, this);
    },

    render: function () {
        this.$el.html(this.template());
        this.groups.fetch({reset: true});
        return this;
    },

    addGroups: function(collection) {
        var groupView = new SidebarGroupView({
            collection: collection,
            parentView: this
        });
        this.$('nav').append(groupView.render().el);
    },

    handleSelectedGroup: function (model) {
        this.$('.nav-group-item').removeClass('active');
        this.$('.nav-group-item[data-id="'+model.id+'"]').addClass('active');
    }
});