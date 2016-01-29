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
    className: 'grid-block pane-entries medium-3',

    events: {
        'click .list-group-item': 'loadEntry',
        'click .btn-add': 'createEntry',
        'keyup .search': 'search'
    },

    initialize: function () {
        Buttercup.Events.on('groupLoaded', this.handleGroupSelection, this);
        this.template = _.template(Tpl);
        this._views = {};
    },

    render: function () {
        this.$el.html(this.template());
        return this;
    },

    setGroup: function (model) {
        this._views = {};
        this.collection = new Entries([], {
            parentID: model.id
        });
        this.collection.on('reset', this.groupLoaded, this);
        this.collection.on('add', this.addEntry, this);
        this.collection.on('remove', this.removeEntry, this);
        this.collection.fetch({reset: true});
        this.$('.pane-footer').addClass('active');
    },

    groupLoaded: function (collection) {
        Buttercup.Events.trigger('groupLoaded', collection);
        this.addEntries(collection);
    },

    addEntries: function (collection) {
        this.$('.list-group-item').remove();

        _.each(collection.models, (model) => {
            this.addEntry.call(this, model, false);
        });
    },

    addEntry: function (model, load) {
        load = (load !== false);
        var view = new EntryItemView({
            model: model
        });
        this.$('.list-entries').prepend(view.render().el);
        this._views[model.get('id')] = view;

        if (load) {
            view.$el.trigger('click');
        }
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
    },

    createEntry: function (e) {
        this.collection.create({
            title: 'Untitled'
        }, {wait: true});
    },

    removeEntry: function (model) {
        this._views[model.get('id')].$el.remove();
        delete this._views[model.get('id')];

        if (this.collection.size() > 0) {
            this.$('.list-entries > li:first').trigger('click');
        } else {
            Buttercup.Events.trigger("entrySelected", false);
        }
    },

    search: function (e) {
        var $el = this.$(e.currentTarget),
            result = this.collection.search($el.val());

        if (result instanceof Entries !== true) {
            result = {
                models: result
            }
        }
        this.addEntries(result);
    },

    handleGroupSelection: function(group) {
        this.$el.toggleClass("active", (group !== false));
    }
});
