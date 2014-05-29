var _ = require('lodash');

var File = function (name) {
  this.name = name;
  this.path = name;
  this.parent = null;
};

_.extend(File.prototype, {

  setParent: function (parent) {
    this.parent = parent;
    this.path = this.parent.path + this.name;
  }

});

module.exports = File;
