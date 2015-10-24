import Backbone from 'backbone';
var ipc = require('ipc');

    function isObject(item) {
        return item === Object(item);
    }

    function contains(array, item) {
        var i = array.length;
        while (i--) if (array[i] === item) return true;
        return false;
    }

    function extend(obj, props) {
        for (var key in props) obj[key] = props[key]
        return obj;
    }

    function result(object, property) {
        if (object == null) return void 0;
        var value = object[property];
        return (typeof value === 'function') ? object[property]() : value;
    }

    Backbone.Buttercup = window.Store = function(namespace) {
        this.namespace = namespace;
    };

    extend(Backbone.Buttercup.prototype, {

        // Save the current state of the **Store** to *localStorage*.
        save: function() {
            return ipc.sendSync('save');
        },

        // Add a model, giving it a (hopefully)-unique GUID, if it doesn't already
        // have an id of it's own.
        create: function(model) {
            model = ipc.sendSync(this.namespace + '.create', model);
            this.save();
            return this.find(model);
        },

        // Update a model by replacing its copy in `this.data`.
        update: function(model) {
            this.localStorage().setItem(this._itemName(model.id), this.serializer.serialize(model));
            var modelId = model.id.toString();
            if (!contains(this.records, modelId)) {
                this.records.push(modelId);
                this.save();
            }
            return this.find(model);
        },

        // Retrieve a model from `this.data` by id.
        find: function(model) {
            return ipc.sendSync(this.namespace + '.find', model.id);
        },

        // Return the array of all models currently in storage.
        findAll: function() {
            return ipc.sendSync(this.namespace + '.all');
        },

        // Delete a model from `this.data`, returning it.
        destroy: function(model) {
            ipc.sendSync(this.namespace + '.delete', model.id);
            this.save();
            return model;
        },

        localStorage: function() {
            return localStorage;
        }

    });


    Backbone.Buttercup.sync = window.Store.sync = Backbone.localSync = function(method, model, options) {
        var store = result(model, 'buttercup') || result(model.collection, 'buttercup');

        var resp, errorMessage;
        //If $ is having Deferred - use it.
        var syncDfd = Backbone.$ ?
            (Backbone.$.Deferred && Backbone.$.Deferred()) :
            (Backbone.Deferred && Backbone.Deferred());

        try {

            switch (method) {
                case "read":
                    resp = model.id != undefined ? store.find(model) : store.findAll();
                    break;
                case "create":
                    resp = store.create(model);
                    break;
                case "update":
                    resp = store.update(model);
                    break;
                case "delete":
                    resp = store.destroy(model);
                    break;
            }

        } catch(error) {
            errorMessage = error.message;
        }

        if (resp) {
            if (options && options.success) {
                options.success(resp);
            }
            if (syncDfd) {
                syncDfd.resolve(resp);
            }

        } else {
            errorMessage = errorMessage ? errorMessage : "Record Not Found";

            if (options && options.error) {
                options.error(errorMessage);
            }

            if (syncDfd) {
                syncDfd.reject(errorMessage);
            }
        }

        // add compatibility with $.ajax
        // always execute callback for success and error
        if (options && options.complete) {
            options.complete(resp);
        }

        return syncDfd && syncDfd.promise();
    };

    Backbone.ajaxSync = Backbone.sync;

    Backbone.getSyncMethod = function(model, options) {
        var forceAjaxSync = options && options.ajaxSync;

        if(!forceAjaxSync && (result(model, 'buttercup') || result(model.collection, 'buttercup'))) {
            return Backbone.localSync;
        }

        return Backbone.ajaxSync;
    };

    // Override 'Backbone.sync' to default to localSync,
    // the original 'Backbone.sync' is still available in 'Backbone.ajaxSync'
    Backbone.sync = function(method, model, options) {
        return Backbone.getSyncMethod(model, options).apply(this, [method, model, options]);
    };

export default Backbone;