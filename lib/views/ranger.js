'use strict';

var Base, Item, ItemView, Pane, PaneView, Ranger, template, vent;

Base = require('base');

// Global event passer
vent = new Base.Event();

// Templates
template = {
  pane: require('../templates/pane'),
  item: require('../templates/item')
};

// Intialise views
PaneView = require('../views/panes')(vent, template.pane);
ItemView = require('../views/items')(vent, template.item);

// Models
Pane  = require('../models/pane');
Item  = require('../models/item');

Ranger = Base.View.extend({

  constructor: function () {
    Ranger.__super__.constructor.apply(this, arguments);

    this.current = {
      pane: null,
       item: null
    };

    this.pane = new Pane();

    this.listen([
      this.pane, {
        'refresh': this.addOne.bind(this),
        'before:destroy': this.remove.bind(this)
      },
      vent, {
        'select:item': this.selectItem.bind(this),
        'select:pane': this.selectPane.bind(this),
        'show:pane': this.addOne.bind(this)
      }
    ]);

  },

  // Select a pane
  selectPane: function (pane) {
    this.current.pane = pane;
    this.el.find('.active.pane').removeClass('active');
  },

  // Select an item
  selectItem: function (item, pane) {
    this.current.item = item;
    this.recheck(pane);
    if (!item.child) {
      return;
    }
    vent.trigger('show:pane', item.child);
  },

  // Remove panes that aren't displayed
  recheck: function (pane) {
    var self = this;
    return pane.contents.forEach(function (item) {
      if (!item.child) {
        return;
      }
      item.child.trigger('remove');
      self.recheck(item.child);
    });
  },

  // Render a pane
  addOne: function (pane) {
    var view = new PaneView({
      pane: pane
    });
    this.el.append(view.render().el);
  },

  // Destroying the view of a pane when the model is destroyed
  // Also destroy all child views
  remove: function (pane) {
    pane.trigger('remove');
    this.recheck(pane);
  },

  // Select the first item in the first pane
  selectFirst: function () {
    var item = this.pane.contents.first();
    this.pane.contents.trigger('click:item', item);
  },

  // Move up
  up: function () {
    if (! this.current.pane) return this.selectFirst();
    this.current.pane.trigger('move:up');
  },

  // Move down
  down: function () {
    if (! this.current.pane) return this.selectFirst();
    this.current.pane.trigger('move:down');
  },

  // Move right
  right: function () {
    if (! this.current.pane) return;
    this.current.pane.trigger('move:right');
  },

  // Move left
  left: function () {
    var current, item, pane, _ref;
    current = this.current.pane;
    if (current === undefined || current.parent === undefined) return;
    item = this.current.pane.parent;
    pane = item.collection;
    pane.trigger('click:item', item);
  },

  // Return the selcted item
  open: function () {
    return this.current.item.data;
  }

});

module.exports = Ranger;
