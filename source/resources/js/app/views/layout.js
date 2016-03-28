"use strict";

// Import Deps
import _ from 'underscore';
import Backbone from 'backbone';
import Tpl from 'tpl/layout.html';
import SidebarView from 'app/views/sidebar';
import EntriesView from 'app/views/entries';
import EntryView from 'app/views/entry';
import EmptyStateView from 'app/views/empty-state';

// Export View
export default Backbone.View.extend({
    el: '.window',

    initialize: function () {
        // Instances
        this.template = _.template(Tpl);
        this.sidebar = new SidebarView;
        this.entries = new EntriesView;

        Buttercup.Events.on('groupSelected', this.entries.setGroup, this.entries);
        Buttercup.Events.on('groupLoaded', this.handleSelectedGroup, this);
        Buttercup.Events.on('entrySelected', this.loadEntry, this);

        // Render
        this.render();
    },

    render: function () {
        this.$el.html(this.template(this.params));
        this.$('.panes').prepend(this.entries.render().el);
        this.$('.panes').prepend(this.sidebar.render().el);
        this.showEmptyState();
    },

    handleSelectedGroup: function (collection) {
        this.showEmptyState();
    },

    loadEntry: function (model) {
        if (model === false) {
            this.showEmptyState();
        } else {
            if (this.entry) {
                this.entry.destroy();
            }
            this.entry = new EntryView({
                model: model
            });
            this.$('.pane-entry').html(this.entry.render().el);
        }
    },

    showEmptyState: function() {
        if (this.entry) {
            this.entry.destroy();
        }
        this.$('.pane-entry').html((new EmptyStateView({type: "entry"})).render().el);
    }
});
