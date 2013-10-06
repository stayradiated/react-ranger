/*jslint browser: true, node: true, nomen: true*/

(function () {

    'use strict';

    var Base, Item, Items;

    Base = require('base');

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
            Pane = require('../models/pane').prototype.model;
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
