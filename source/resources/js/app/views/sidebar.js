"use strict";

// Import Deps
import _ from 'underscore';
import Backbone from 'backbone';
import Tpl from 'tpl/sidebar.html!text';
import Groups from 'app/collections/groups';
import Group from 'app/models/group';
import SidebarGroupView from 'app/views/sidebar-group';

// Export View
export default Backbone.View.extend({
    className: 'grid-block sidebar medium-3',

    events: {
        'click .group-add': 'addGroup'
    },

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
        this.$('.active').removeClass('active');
        this.$('a[data-id="'+model.id+'"]').parent().addClass('active');
    },

    addGroup: function (e) {
        e.preventDefault();
        this.groups.add(new Group());
    }
});
