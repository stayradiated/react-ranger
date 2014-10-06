'use strict';

var _ = require('lodash');

var ItemList = function () {
  this.items = [];
  this._index = -1;
};

_.extend(ItemList.prototype, {

  /*
   * EVENTS
   */

  _onPush: _.noop,


  /*
   * METHODS
   */

  next: function () {
    this._index = Math.min(this._index + 1, this.items.length - 1);
  },

  prev: function () {
    this._index = Math.max(this._index - 1, 0);
  },

  select: function (item) {
    var index = this.indexOf(item);
    if (index < 0) { return; }
    this._index = index;
  },

  active: function () {
    return this.items[this._index];
  },

  get: function (name) {
    for (var i = 0, len = this.items.length; i < len; i += 1) {
      var item = this.items[i];
      if (item.name === name) {
        return item;
      }
    }
    return undefined;
  },


  /*
   * ARRAY STUFF
   */

  push: function (item) {
    var length = this.items.push(item);
    this._onPush(item);
    if (this._index < 0) {
      this._index = 0;
    }
    return length;
  },

  indexOf: function (item) {
    return this.items.indexOf(item);
  },

  at: function (i) {
    return this.items[i];
  },

  length: function () {
    return this.items.length;
  },

  forEach: function (fn, context) {
    return this.items.forEach(fn, context);
  },

  map: function (fn, context) {
    return this.items.map(fn, context);
  },

  sort: function () {
    return this.items = _.sortBy(this.items, ['type', 'name']);
  },

});

module.exports = ItemList;
