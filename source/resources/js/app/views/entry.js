'use strict';

// Import Deps
import _ from 'underscore';
import Backbone from 'backbone';
import Tpl from 'tpl/entry.html!text';
import Metatpl from 'tpl/entry-new-meta.html!text';
import {confirmDialog} from 'app/tools/dialog';
import {generatePassword} from 'app/tools/generate'

// New Meta View
var MetaEntryView = Backbone.View.extend({
    className: 'row',

    render: function () {
        this.template = _.template(Metatpl);
        this.$el.html(this.template());
        this.$el.attr('data-custom-field-row', true);
        return this;
    }
});

// Export View
export default Backbone.View.extend({
    className: 'grid-block vertical entry-view',

    events: {
        'keyup input': 'setFieldsOnChange',
        'click .btn-save': 'saveEntry',
        'click .btn-cancel': 'cancelChanges',
        'click .btn-remove': 'removeEntry',
        'keypress h1': 'manageTitleChange',
        'click .toggle-password': 'togglePasswordField',
        'click .generate-password': 'generateRandomPassword',
        'click .add-new-meta': 'addNewMeta',
        'click .btn-remove-meta': 'removeMeta'
    },

    initialize: function () {
        this.template = _.template(Tpl);
        this.model.on('change', this.showHideActionBar, this);
    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        if (this.model.get("title") === "Untitled") {
            setTimeout(() => {
                this.$('input[name=title]').select();
            }, 50);
        }
        this.removedMeta = [];
        return this;
    },

    setFieldsOnChange: function (e) {
        $(e.currentTarget).attr('data-changed', true);
        this.showHideActionBar(true);
    },

    showHideActionBar: function (showHideFlag) {
        this.$('.action-buttons').toggleClass('hide', !showHideFlag);
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

    generateRandomPassword: function (e) {
        e.preventDefault();
        var $field = this.$('input[name=password]'),
            type = $field.attr('type');

        $field.val(generatePassword());
        $field.keyup();
    },

    addNewMeta: function (e) {
        e.preventDefault();
        var view = new MetaEntryView();
        this.$('form').append(view.render().el);
    },

    removeMeta: function (e) {
        e.preventDefault();

        var $el = $(e.currentTarget),
            metaKey = $el.data('meta');
        if (metaKey) {
            this.removedMeta.push(metaKey);
            this.showHideActionBar(true);
        }
        $el.parents('[data-custom-field-row]').remove();
    },

    saveEntry: function () {
        var changed  = {
            meta: {}
        };

        // Normal fields
        this.$('input[name][data-changed]').each(function (index, field) {
            changed[field.getAttribute('name')] = field.value;
        });

        // Removed Custom Fields
        this.removedMeta.forEach((key) => {
            this.model.unset('meta.' + key);
        });

        // New Custom Fields
        this.$('input[data-custom-field-title]').each(function (index, field) {
            var $field = $(field),
                $next  = $field.parents('.grid-block').find('input[data-custom-field-value]'),
                key    = $field.val(),
                value  = $next.val();
            if (key.length > 0 && value.length > 0) {
                changed.meta[$field.val()] = $next.val();
            }
        });

        // Changed custom fields
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
        confirmDialog(
            `Delete ${this.model.get("title")}?`,
            `Are you sure you want to delete this entry?`,
            (confirm) => {
                if (confirm === true) {
                    this.model.destroy({
                        wait: true,
                        success: (model) => {
                            Buttercup.Events.trigger("entryRemoved", model);
                            this.destroy()
                        }
                    });
                }
            }
        );
    }
});
