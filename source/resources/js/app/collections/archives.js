"use strict";

import Backbone from 'backbone';
import BackboneLocalStorage from 'app/lib/backbone.localStorage';
import Archive from 'app/models/archive';

export default Backbone.Collection.extend({
    localStorage: new Backbone.LocalStorage('Archives'),
    model: Archive
});