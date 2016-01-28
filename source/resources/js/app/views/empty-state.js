"use strict";

import Backbone from 'backbone';
import _ from 'underscore';
import Tpl from 'tpl/empty-state.html!text';

export default Backbone.View.extend({

    template: _.template(Tpl),
    className: 'empty-state-container v-align',

    initialize: function() {

    },

    render: function() {
        this.$el.html(this.template());
        return this;
    }

});
