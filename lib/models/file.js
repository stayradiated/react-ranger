var _ = require('lodash');

var File = function (name, contents) {
  this.name = name;
  this.path = name;
  this.parent = null;
  this.contents = contents;
};

_.extend(File.prototype, {

  type: 'file',

  setParent: function (parent) {
    this.parent = parent;
    this.path = this.parent.path + this.name;
  }

});

module.exports = File;
