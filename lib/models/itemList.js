var _ = require('lodash');

var FileList = function () {
  this.items = [];
};

_.extend(FileList.prototype, {

  _onAdd: _.noop,

  add: function (item) {
    this.items.push(item);
    this._onAdd(item);
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
  }

});

module.exports = FileList;
