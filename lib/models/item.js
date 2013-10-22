/*jslint browser: true, node: true, nomen: true*/

(function () {

    'use strict';

    var Base, Item, Items, Pane;

    Base = require('base');
    Pane = require('../models/pane');

    // Item Model
    Item = Base.Model.extend({

        defaults: {
            title: '',
            child: false,
            data: false
        },

        constructor: function (attrs) {
            var Pane;
            Item.__super__.constructor.apply(this, arguments);
            if (attrs.child === undefined) {
                return;
            }
            this.child = new Pane(attrs.child);
            this.child.parent = this;
        }

    });


    // Item Collection
    Items = Base.Collection.extend({

        constructor: function () {
            return Items.__super__.constructor.apply(this, arguments);
        },

        model: Item

    });

    module.exports = Items;

}());
