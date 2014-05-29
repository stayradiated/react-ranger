var _ = require('lodash');
var ItemList = require('./itemList');

var Directory = function (name) {
  this.name = name;
  this.path = name + '/';
  this.contents = new ItemList();
  this.contents._onAdd = this._handleAdd.bind(this);
};

_.extend(Directory.prototype, {

  _handleAdd: function (item) {
    item.setParent(this);
  },

  setParent: function (parent) {
    this.parent = parent;
    this.path = this.parent.path + this.name + '/';
  }

});

module.exports = Directory;
