"use strict";

import Backbone from 'backbone';
import _ from 'underscore';
import Tpl from 'tpl/empty-state.html!text';

export default Backbone.View.extend({

    template: _.template(Tpl),
    className: 'empty-state-container v-align',

    initialize: function(options) {
        this.options = options;
    },

    render: function() {
        this.$el.html(this.template());
        this.$(`[data-id=${this.options.type}]`).addClass("active");
        return this;
    }

});
