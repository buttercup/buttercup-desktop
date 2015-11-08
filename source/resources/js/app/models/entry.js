"use strict";

import Backbone from 'backbone';
import BackboneButtercup from 'app/lib/backbone.buttercup';

export default Backbone.Model.extend({
    buttercup: new Backbone.Buttercup('entries'),
    parse: function(response) {
        for (var key in response.properties) {
            response[key] = response.properties[key];
        }
        delete response.properties;
        return response;
    }
});