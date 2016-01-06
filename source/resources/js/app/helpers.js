"use strict";

import _ from "underscore";
import "app/lib/underscore.template-helpers";

// Add Mixins
_.addTemplateHelpers({
    icon: function(iconName) {
        return `<svg class="icon">
                    <use xlink:href="img/icons/svg/sprite.symbol.svg#${iconName}"></use>
                </svg>`;
    },

    filename: function(path) {
        return path.replace(/^.*[\\\/]/, '');
    }
});
