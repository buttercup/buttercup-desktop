'use strict';

// Import Deps
import _ from 'underscore';
import Backbone from 'backbone';
import Tpl from 'tpl/entry.html!text';
import Metatpl from 'tpl/entry-new-meta.html!text';

// New Meta View
var MetaEntryView = Backbone.View.extend({
    className: 'form-group split-form-group',

    render: function () {
        this.template = _.template(Metatpl);
        this.$el.html(this.template());
        return this;
    }
});

// Export View
export default Backbone.View.extend({
    className: 'pane entry-view',

    events: {
        'keyup input': 'setFieldsOnChange',
        'click .btn-save': 'saveEntry',
        'click .btn-cancel': 'cancelChanges',
        'click .btn-remove': 'removeEntry',
        'keypress h1': 'manageTitleChange',
        'click .toggle-password': 'togglePasswordField',
        'click .add-new-meta': 'addNewMeta'
    },

    initialize: function () {
        this.template = _.template(Tpl);
        if (this.model) {
            this.model.on('change', this.showHideActionBar, this);
            this.model.on('destroy', function () {
                console.log("model destroyed");
            });
        }
    },

    render: function () {
        this.$el.html(this.template(
            this.model ? this.model.toJSON() : {
                blank: true
            }
        ));
        return this;
    },

    setFieldsOnChange: function (e) {
        $(e.currentTarget).attr('data-changed', true);
        this.showHideActionBar(true);
    },

    showHideActionBar: function (showHideFlag) {
        this.$('.view-footer .left').toggle(!!showHideFlag);
    },

    manageTitleChange: function (e) {
        this.showHideActionBar(true);
        if (e.which === 13) {
            e.preventDefault();
            return false;
        }
    },

    togglePasswordField: function (e) {
        e.preventDefault();
        var $field = this.$('input[name=password]'),
            type = $field.attr('type');

        $(e.currentTarget).toggleClass('active', (type !== 'text'));
        $field.attr('type', (type === 'text') ? 'password' : 'text');
    },

    addNewMeta: function (e) {
        e.preventDefault();
        var view = new MetaEntryView();
        this.$('form').append(view.render().el);
    },

    saveEntry: function () {
        var changed  = {
            meta: {}
        };

        // Title field
        changed.title = this.$('h1').text().trim();

        // Normal fields
        this.$('input[name][data-changed]').each(function (index, field) {
            changed[field.getAttribute('name')] = field.value;
        });

        // Custom Fields
        this.$('input[data-custom-field-title]').each(function (index, field) {
            var $field = $(field),
                $next  = $field.next('input[data-custom-field-value'),
                key    = $field.val(),
                value  = $next.val();
            if (key.length > 0 && value.length > 0) {
                changed.meta[$field.val()] = $next.val();
            }
        });

        this.$('[data-custom-field][data-changed]').each(function (index, field) {
            changed.meta[field.getAttribute('data-custom-field')] = field.value;
        });

        // Set new attributes
        this.model.set(changed);

        this.model.save({}, {
            wait: true,
            success: () => {
                this.render();
            }
        });
    },

    cancelChanges: function () {
        this.render();
    },

    destroy: function () {
        this.$el.remove();
    },

    removeEntry: function () {
        this.model.destroy({
            wait: true,
            success: () => {
                this.destroy()
            }
        });
    }
});