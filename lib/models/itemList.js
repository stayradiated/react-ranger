var _ = require('lodash');

var ItemList = function () {
  this.items = [];
  this._index = -1;
};

_.extend(ItemList.prototype, {

  _onAdd: _.noop,

  add: function (item) {
    this.items.push(item);
    this._onAdd(item);
    if (this._index < 0) this._index = 0;
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

  next: function () {
    this._index = Math.min(this._index + 1, this.items.length - 1);
  },

  prev: function () {
    this._index = Math.max(this._index - 1, 0);
  },

  active: function () {
    return this.items[this._index];
  },

  sort: function () {
    this.items = _.sortBy(this.items, ['type', 'name']);
  }

});

module.exports = ItemList;
