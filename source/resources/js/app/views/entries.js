"use strict";

// Import Deps
import _ from 'underscore';
import Backbone from 'backbone';
import Tpl from 'tpl/entries.html!text';
import EntryItemTpl from 'tpl/entry-list-item.html!text';
import Entries from 'app/collections/entries';

var EntryItemView = Backbone.View.extend({
    className: 'list-group-item',
    tagName: 'li',

    initialize: function () {
        this.template = _.template(EntryItemTpl);
        this.model.on('sync', this.render, this);
    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        this.$el.data('id', this.model.id);
        return this;
    }
});

// Export View
export default Backbone.View.extend({
    className: 'pane pane-sm',

    events: {
        'click .list-group-item': 'loadEntry'
    },

    initialize: function () {
        this.template = _.template(Tpl);
    },

    render: function () {
        this.$el.html(this.template());
        return this;
    },

    setGroup: function (model) {
        this.collection = new Entries([], {
            parentID: model.id
        });
        this.collection.on('reset', this.addEntries, this);
        this.collection.fetch({reset: true});
    },

    addEntries: function (collection) {
        var _this = this;

        Buttercup.Events.trigger('groupLoaded', collection);
        this.$('.list-group-item').remove();

        _.each(collection.models, function (model) {
            _this.addEntry(model);
        });
    },

    addEntry: function (model) {
        var view = new EntryItemView({
            model: model
        });
        this.$('ul').append(view.render().el);
    },

    loadEntry: function (e) {
        var $el = this.$(e.currentTarget),
            id = $el.data('id'),
            model = this.collection.get(id);

        // Changed active state
        this.$('li').removeClass('selected');
        $el.addClass('selected');

        // Trigger event
        Buttercup.Events.trigger('entrySelected', model);
    }
});