'use strict';

var View, Ranger, Pane;

View = require('../views/ranger');
Pane = require('../models/pane');

Ranger = function (attrs) {
  this._view = new View(attrs);

  this.up = this._view.up.bind(this._view);
  this.down = this._view.down.bind(this._view);
  this.left = this._view.left.bind(this._view);
  this.right = this._view.right.bind(this._view);
  this.open = this._view.open.bind(this._view);
};

Ranger.prototype.setPanes = function(panes) {
  this._panes = panes;
  this.clear();
};

Ranger.prototype.findPane = function(name) {
  for (var i = this._panes.length - 1; i >= 0; i--) {
    if (this._panes[i][1] == name) {
      return i;
    }
  }
  return -1;
};

// Remove all the current items
Ranger.prototype.clear = function() {
  this._view.pane.destroy();
  this._view.pane.refresh({
    title: this._panes[0][0],
    key: this._panes[0][1]
  }, true);
};

Ranger.prototype.load = function(array)  {
  var i, id, item, key, length, main, map, out, title, x, j, alen, plen;

  // You can only have one top level pane at a time
  this._view.pane.destroy();

  map    = {};
  main   = {};
  length = this._panes.length - 1;

  // Loop through each item in the array - { object }
  for (i = 0, alen = array.length; i < alen; i += 1) {

      item = array[i];
      out  = main;
      x    = '';

      // Loop through each panel - [name, title]
      for (j = 0, plen = this._panes.length; j < plen; j += 1) {

          title = this._panes[j][0];
          key   = this._panes[j][1];

          out.key = key;
          out.title = title;
          if (out.contents === undefined) {
              out.contents = [];
          }

          x += title + ':' + item[key] + ':';

          if (map[x] === undefined) {
              id = out.contents.push({
                  title: item[key]
              }) - 1;
              map[x] = out.contents[id];
          }

          if (j !== length) {

              if (map[x].child !== undefined) {
                  out = map[x].child;
              } else {
                  out = map[x].child = {};
              }

          } else {
              map[x].data = item;
          }
      }
  }
  this._view.pane = new Pane(main);
};

Ranger.prototype.add = function(object) {
  var first, itemData, self = this;

  // Add the item to the first pane
  itemData = this._addItem(object, this._view.pane);

  // Recursive function
  var addPane = function (itemData) {
    var item, pane, index;

    item = itemData[0];
    pane = itemData[1];
    index = self.findPane(pane.key);

    if (index > -1 && ++index < self._panes.length) {
      pane = self._panes[index];
      item.child = new Pane({
        title: pane[0],
        key: pane[1]
      });
      item.child.parent = item;
      addPane(self._addItem(object, item.child));
    }
  };

  addPane(itemData);

};

Ranger.prototype._addItem = function(object, pane) {
  var key, value, item, data, exists, force, self = this;
  key = pane.key;
  value = object[key];

  force = this.findPane(pane.key) >= this._panes.length - 1;

  if (! force) {
    pane.contents.forEach(function (el) {
      if (! exists && el.title === value && el.child) {
        exists = true;
        data = self._addItem(object, el.child);
      }
    });
  }

  if (! exists || force) {
    item = pane.contents.create({
      title: value
    });
    if (force) item.data = object;
  }

  return data || [item, pane];

};

module.exports = Ranger;
