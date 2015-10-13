"use strict";

// Import Deps
import Backbone from 'backbone';

// Export View
export default Backbone.View.extend({
    el: '#app-content',

    initialize: function () {
        this.render()
    },

    render: function () {
        this.$el.html('Hi! This is totally awesome...');
    }
});