'use strict';

var Base, Pane;

Base = require('base');

/*
 * Pane
 *
 * Represents a column
 *
 * - key (string) : item property name to display
 * - title (string) : the name of the column
 * - contents (item collection) : a collection of items
 */

Pane = Base.Model.extend({

  defaults: {
    key: '',
    title: '',
    contents: null
  },

  constructor: function (attrs) {
    var ItemCollection;

    Pane.__super__.constructor.apply(this, arguments);

    ItemCollection = require('../models/item');
    this.contents = new ItemCollection();

    if (attrs && attrs.contents) {
      this.contents.refresh(attrs.contents, true);
    }

    this.on('refresh', function (self) {
      self.contents = new ItemCollection();
    });
  }

});

module.exports = Pane;
