"use strict";

// Import Deps
import _ from 'underscore';
import Backbone from 'backbone';
import Tpl from 'tpl/layout.html!text';
import SidebarView from 'app/views/sidebar';

// Export View
export default Backbone.View.extend({
    el: '.window',

    initialize: function () {
        // Instances
        this.template = _.template(Tpl);
        this.sidebar = new SidebarView;
        this.on('groupSelected', function (model) {
            console.log('Selected model:', model);
        });

        // Render
        this.render();
    },

    render: function () {
        this.$el.html(this.template());
        this.$('.pane-group').prepend(this.sidebar.render().el);
    }
});