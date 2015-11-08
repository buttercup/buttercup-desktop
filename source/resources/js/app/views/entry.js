'use strict';

// Import Deps
import _ from 'underscore';
import Backbone from 'backbone';
import Tpl from 'tpl/entry.html!text';

// Export View
export default Backbone.View.extend({
    className: 'pane entry-view',

    events: {
        'keyup input': 'setFieldsOnChange',
        'click .btn-save': 'saveEntry'
    },

    initialize: function () {
        this.template = _.template(Tpl);
        if (this.model) {
            this.model.on('change', this.showHideActionBar, this);
            this.model.on('sync', this.showHideActionBar, this);
        }
    },

    render: function () {
        this.$el.html(this.template(
            this.model ? this.model.toJSON() : {
                blank: true
            }
        ));
        this.$fields = this.$('input');
        return this;
    },

    setFieldsOnChange: function (e) {
        var $field = this.$(e.currentTarget);
        this.model.set($field.attr('name'), $field.val());
    },

    showHideActionBar: function () {
        this.$('.view-footer').toggle(this.model.hasChanged());
    },

    saveEntry: function () {
        this.model.save({}, {
            wait: true
        });
    },

    destroy: function () {
        this.$el.remove();
    }
});