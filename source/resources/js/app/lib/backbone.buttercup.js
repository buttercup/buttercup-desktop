import Backbone from 'backbone';
var ipc = require('electron').ipcRenderer;

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

        save: function() {
            return ipc.sendSync('save');
        },

        create: function(model) {
            var result = ipc.sendSync(this.namespace + '.create', model);
            this.save();
            return result;
        },

        update: function(model) {
            var result = ipc.sendSync(this.namespace + '.update', model);
            this.save();
            return result;
        },

        find: function(model) {
            return ipc.sendSync(this.namespace + '.find', model.id);
        },

        findAll: function(parentID) {
            return ipc.sendSync(this.namespace + '.all', parentID);
        },

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
        var store = result(model, 'buttercup') || result(model.collection, 'buttercup'),
            parentID = false;

        if (typeof model.options !== "undefined" && "parentID" in model.options) {
            parentID = model.options.parentID;
        }

        var resp, errorMessage;
        //If $ is having Deferred - use it.
        var syncDfd = Backbone.$ ?
            (Backbone.$.Deferred && Backbone.$.Deferred()) :
            (Backbone.Deferred && Backbone.Deferred());

        try {

            switch (method) {
                case "read":
                    resp = model.id != undefined ? store.find(model) : store.findAll(parentID);
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