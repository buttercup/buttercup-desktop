"use strict";

// Import Deps
import _ from 'underscore';
import Backbone from 'backbone';
import Tpl from 'tpl/sidebar.html!text';

// Export View
export default Backbone.View.extend({
    className: 'pane-sm sidebar',

    initialize: function () {
        this.template = _.template(Tpl);
    },

    render: function () {
        this.$el.html(this.template());
        return this;
    }
});