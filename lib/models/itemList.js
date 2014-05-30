var _ = require('lodash');

var FileList = function () {
  this.items = [];
  this._index = -1;
};

_.extend(FileList.prototype, {

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

  min: function () {
    return 0;
  },

  max: function () {
    return this.items.length - 1;
  },

  length: function () {
    return this.items.length;
  },

  map: function (fn, context) {
    return this.items.map(fn, context);
  },

  next: function () {
    this._index = Math.min(this._index + 1, this.max());
  },

  prev: function () {
    this._index = Math.max(this._index - 1, this.min());
  },

  active: function () {
    return this.items[this._index];
  }

});

module.exports = FileList;
