'use strict';

var Base, Item, Items, Pane;

Base = require('base');
Pane = require('../models/pane');

// Item Model
Item = Base.Model.extend({

  defaults: {
    id: null,
    title: '',
    child: false,
    data: false
  },

  constructor: function (attrs) {
    var Pane;
    Item.__super__.constructor.apply(this, arguments);
    if (typeof attrs.child !== 'undefined') {
      this.child = new Pane(attrs.child);
      this.child.parent = this;
    }
  }

});


// Item Collection
Items = Base.Collection.extend({

  model: Item

});

module.exports = Items;

