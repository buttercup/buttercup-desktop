"use strict";

import Backbone from 'app/lib/backbone.buttercup';
import Group from 'app/models/group';

//var model = new Group();
//model.save();

export default Backbone.Collection.extend({
    buttercup: new Backbone.Buttercup(window.Manager),
    model: Group
});