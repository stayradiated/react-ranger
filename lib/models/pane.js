/*jslint browser: true, node: true, nomen: true*/

(function () {

    'use strict';

    var Base, Item, Pane, Panes;

    Base = require('base');
    Item = require('../models/item');

    Pane = Base.Model.extend({

        defaults: {
            title: '',
            key: '',
            contents: null
        },

        constructor: function (attrs) {
            Pane.__super__.constructor.apply(this, arguments);
            this.contents = new Item();
            if (attrs.contents) {
                this.contents.refresh(attrs.contents, true);
            }
        }

    });

    Panes = Base.Collection.extend({

        constructor: function () {
            return Panes.__super__.constructor.apply(this, arguments);
        },

        model: Pane

    });

    module.exports = Panes;

}());
