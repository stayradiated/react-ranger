'use strict';

var _ = require('lodash');
var ItemList = require('./itemList');

var Directory = function (name) {
  this.name = name;
  this.path = name + '/';
  this.contents = new ItemList();
  this.contents._onPush = this._handlePush.bind(this);
};

_.extend(Directory.prototype, {

  type: 'directory',

  _handlePush: function (item) {
    item.setParent(this);
  },

  setParent: function (parent) {
    this.parent = parent;
    this.path = this.parent.path + this.name + '/';
  }

});

module.exports = Directory;
