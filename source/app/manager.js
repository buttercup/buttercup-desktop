(function (module) {
    "use strict";

    var Buttercup = require('buttercup');

    function Manager () {
        this._archive = null;
        this._workspace = null;
    }

    Manager.prototype.setWorkspace = function (workspace) {
        this._workspace = workspace;
        this._archive = workspace.getArchive();
    };

    Manager.prototype.getGroups = function() {
        return this._archive.getGroups();
    };

    Manager.prototype.createGroup = function(title) {
        return this._archive.createGroup(title);
    };

    Manager.prototype.findGroup = function(id) {
        return this._archive.getGroupByID(id);
    };

    Manager.prototype.findEntry = function(id) {
        return this._archive.getEntryByID(id);
    };

    Manager.prototype.save = function() {
        this._workspace.save();
    };

    module.exports = Manager;
})(module);