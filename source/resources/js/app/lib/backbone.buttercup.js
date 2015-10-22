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

    // Our Store is represented by a single JS object in *localStorage*. Create it
    // with a meaningful name, like the name you'd give a table.
    // window.Store is deprectated, use Backbone.LocalStorage instead
    Backbone.Buttercup = window.Store = function(manager) {
        //var store = this.localStorage().getItem(this.name);
        //this.records = (store && store.split(",")) || [];
        this.records = [];
    };

    extend(Backbone.Buttercup.prototype, {

        // Save the current state of the **Store** to *localStorage*.
        save: function() {
            //this.localStorage().setItem(this.name, this.records.join(","));
            console.log('SAVING');
        },

        // Add a model, giving it a (hopefully)-unique GUID, if it doesn't already
        // have an id of it's own.
        create: function(model) {
            /*if (!model.id && model.id !== 0) {
             model.id = guid();
             model.set(model.idAttribute, model.id);
             }
             this.localStorage().setItem(this._itemName(model.id), this.serializer.serialize(model));
             this.records.push(model.id.toString());
             */
            console.log("Create shit", model);
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
            console.log("FINDING MODEL", model);
            return null;
            //return this.serializer.deserialize(this.localStorage().getItem(this._itemName(model.id)));
        },

        // Return the array of all models currently in storage.
        findAll: function() {
            var result = [];
            console.log("FINDING ALL");
            // for (var i = 0, id, data; i < this.records.length; i++) {
            //   id = this.records[i];
            //   data = this.serializer.deserialize(this.localStorage().getItem(this._itemName(id)));
            //   if (data != null) result.push(data);
            // }
            var groups = ipc.sendSync('groups.all', 'shit');
            console.log(groups[0]);
            /*ipc.on('groups.shit', function(reply) {
                console.log(reply);
            });*/

            return result;
        },

        // Delete a model from `this.data`, returning it.
        destroy: function(model) {
            this.localStorage().removeItem(this._itemName(model.id));
            var modelId = model.id.toString();
            for (var i = 0, id; i < this.records.length; i++) {
                if (this.records[i] === modelId) {
                    this.records.splice(i, 1);
                }
            }
            this.save();
            return model;
        },

        localStorage: function() {
            return localStorage;
        },

        // Clear localStorage for specific collection.
        _clear: function() {
            var local = this.localStorage(),
                itemRe = new RegExp("^" + this.name + "-");

            // Remove id-tracking item (e.g., "foo").
            local.removeItem(this.name);

            // Match all data items (e.g., "foo-ID") and remove.
            for (var k in local) {
                if (itemRe.test(k)) {
                    local.removeItem(k);
                }
            }

            this.records.length = 0;
        },

        // Size of localStorage.
        _storageSize: function() {
            return this.localStorage().length;
        },

        _itemName: function(id) {
            return this.name+"-"+id;
        }

    });

// localSync delegate to the model or collection's
// *localStorage* property, which should be an instance of `Store`.
// window.Store.sync and Backbone.localSync is deprecated, use Backbone.LocalStorage.sync instead
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
            if (error.code === 22 && store._storageSize() === 0)
                errorMessage = "Private browsing is unsupported";
            else
                errorMessage = error.message;
        }

        if (resp) {
            if (options && options.success) {
                if (Backbone.VERSION === "0.9.10") {
                    options.success(model, resp, options);
                } else {
                    options.success(resp);
                }
            }
            if (syncDfd) {
                syncDfd.resolve(resp);
            }

        } else {
            errorMessage = errorMessage ? errorMessage
                : "Record Not Found";

            if (options && options.error)
                if (Backbone.VERSION === "0.9.10") {
                    options.error(model, errorMessage, options);
                } else {
                    options.error(errorMessage);
                }

            if (syncDfd)
                syncDfd.reject(errorMessage);
        }

        // add compatibility with $.ajax
        // always execute callback for success and error
        if (options && options.complete) options.complete(resp);

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