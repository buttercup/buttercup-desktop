"use strict";

// Import Deps
import _ from 'underscore';
import Backbone from 'backbone';
import Tpl from 'tpl/entries.html!text';
import EntryItemTpl from 'tpl/entry-list-item.html!text';
import Entries from 'app/collections/entries';
import EmptyStateView from 'app/views/empty-state';

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

        if (this.collection && this.collection.size() > 0) {
            this.addEntries(this.collection);
        } else {
            this.$('.empty').html((new EmptyStateView({type: "entries"})).render().el);
            this.$('.entries').hide();
        }

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
        this.render();
    },

    addEntries: function (collection) {
        this.$('.list-group-item').remove();
        this.toggleEmptyState(collection.size() === 0);

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

        if (this.collection.size() === 1) {
            this.toggleEmptyState(false);
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
        var bbThis = this;
        bbThis._views[model.get('id')].$el.addClass('shift');
        bbThis._views[model.get('id')].$el.on('animationend', function(){
            $(this).remove();
            delete bbThis._views[model.get('id')];
            if (bbThis.collection.size() === 0) {
                Buttercup.Events.trigger("entrySelected", false);
                bbThis.toggleEmptyState(true);
            } else {
                bbThis.$('.list-entries > li:first').trigger('click');
            }
        });
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
    },

    toggleEmptyState: function(flag) {
        this.$('.entries').toggle(!flag);
        this.$('.empty').toggle(flag);
    }

});
