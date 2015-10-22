"use strict";

// Import Deps
import _ from 'underscore';
import Backbone from 'backbone';
import Tpl from 'tpl/layout.html!text';
import SidebarView from 'app/views/sidebar';
import Groups from 'app/collections/groups';

// Export View
export default Backbone.View.extend({
    el: '.window',

    initialize: function () {
        // Instances
        this.template = _.template(Tpl);
        this.sidebar = new SidebarView;

        // Render
        this.render();
        this.groups = new Groups();
        this.groups.fetch();
    },

    render: function () {
        this.$el.html(this.template());
        this.$('.pane-group').prepend(this.sidebar.render().el);
    }
});