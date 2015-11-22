"use strict";

import _ from 'underscore';
import Backbone from 'backbone-nested';
import BackboneButtercup from 'app/lib/backbone.buttercup';

export default Backbone.NestedModel.extend({
    buttercup: new Backbone.Buttercup('entries'),

    parse: function(response) {
        for (var key in response.properties) {
            if (response.properties.hasOwnProperty(key)) {
                response[key] = response.properties[key];
            }
        }
        delete response.properties;

        return response;
    }
});