"use strict";

import _ from 'underscore';
import Backbone from 'backbone';
import GroupItemTpl from 'tpl/sidebar-group-item.html!text';
import SidebarGroupView from 'app/views/sidebar-group';
import Groups from 'app/collections/groups';

export default Backbone.View.extend({
    tagName: 'li',

    events: {
        'click a[data-id]': 'handleClick',
        'click .group-add': 'addGroup',
        'click .group-remove': 'removeGroup',
        'keydown [data-title]': 'handleTitleChange'
    },

    initialize: function (options) {
        this.template = _.template(GroupItemTpl);
        this.options = options;
        this.model.on('destroy', this.destroy, this);
    },

    render: function () {
        // Render
        var json = this.model.toJSON();
        json.isNew = this.model.isNew();
        this.$el.html(this.template(json));

        // Render childs
        if (!this.model.isNew()) {
            if (typeof this.model.groups === "undefined") {
                this.model.groups = new Groups([], {
                    parentID: this.model.id
                });
            }

            this.groupView = new SidebarGroupView({
                collection: this.model.groups,
                parentView: this.options.parentView
            });
            this.$el.append(this.groupView.render().el);
            this.$el.toggleClass("has-groups", this.model.groups.size() > 0);
        } else {
            window.setTimeout(() => {
                this.$('[data-title]').trigger('focus');
                document.execCommand('selectAll', false, null);
            }, 10);
        }

        return this;
    },

    handleTitleChange: function (e) {
        // Set title
        var title = this.$('[data-title]').text().trim();

        // Find out what to do with keyboard
        switch (e.which) {
            case 13:
                this.model.save({title: title}, {
                    success: () => {
                        this.render();
                    }
                });
                return false;
                break;
            case 27:
                this.model.destroy();
                break;
            default:
                break;
        }
    },

    handleClick: function (e) {
        e.stopPropagation();
        e.preventDefault();

        // Toggle Tree
        this.toggleTree();

        // Load the group if it isn’t already loaded
        if (!this.$(e.currentTarget).parent().hasClass('active') && !this.model.isNew()) {
            Buttercup.Events.trigger('groupSelected', this.model);
        }
    },

    addGroup: function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.model.groups.add(new Group());
        this.expandTree();
    },

    removeGroup: function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.model.destroy();
    },

    destroy: function () {
        this.$el.remove();
    },

    expandTree: function() {
        this.$el.find("> ul").show();
        this.$el.addClass("expanded has-groups");
    },

    toggleTree: function() {
        this.$el.find("> ul").toggle();
        this.$el.toggleClass("expanded");
    }
});
