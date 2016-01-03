"use strict";

import _ from "underscore";
import "app/lib/underscore.template-helpers";

// Add Mixins
_.addTemplateHelpers({
    icon: function(iconName) {
        return "<strong></strong>";
    },

    filename: function(path) {
        return path.replace(/^.*[\\\/]/, '');
    }
});
