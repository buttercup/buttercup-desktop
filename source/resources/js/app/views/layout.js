"use strict";

// Import Deps
import _ from 'underscore';
import Backbone from 'backbone';
import Tpl from 'tpl/layout.html!text';
import SidebarView from 'app/views/sidebar';
import EntriesView from 'app/views/entries';

// Export View
export default Backbone.View.extend({
    el: '.window',

    initialize: function () {
        // Instances
        this.template = _.template(Tpl);
        this.sidebar = new SidebarView;
        this.entries = new EntriesView;
        this.on('groupSelected', this.entries.setGroup, this.entries);

        // Render
        this.render();
    },

    render: function () {
        this.$el.html(this.template());
        this.$('.pane-group').prepend(this.entries.render().el);
        this.$('.pane-group').prepend(this.sidebar.render().el);
    }
});