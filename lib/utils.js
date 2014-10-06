'use strict';

var _ = require('lodash');
var Path = require('path');

var File = require('./models/file');
var Directory = require('./models/directory');

var sortContents = function (list) {
  list.contents.sort();
  list.contents.forEach(function (item) {
    if (item instanceof Directory) {
      sortContents(item);
    }
  });
  return list;
};

var mkdir = function (list, name) {
  var items = list.contents.items;

  // Look for existing directorys
  for (var i = 0, len = items.length; i < len; i += 1) {
    var item = items[i];
    if (item instanceof Directory && item.name === name) {
      return item;
    }
  }

  var dir = new Directory(name);
  list.contents.push(dir);
  return dir;
};

var RangerUtils = {

  parseList: function (list, options) {

    var isDirectory = /\/$/m;

    var root = (options && options.root) || new Directory('');

    list.forEach(function (fullPath) {

      if (fullPath[0] === '/') {
        fullPath = fullPath.slice(1);
      }

      var item;
      var name = Path.basename(fullPath);

      if (isDirectory.test(fullPath)) {
        item = new Directory(name);
        fullPath = fullPath.slice(0, -1);
      } else {
        item = new File(name);
      }

      var path = fullPath.split(Path.sep);
      var parent = root;

      for (var i = 0, len = path.length - 1; i < len; i += 1) {
        parent = mkdir(parent, path[i]);
      }

      parent.contents.push(item);
    });

    return sortContents(root);
  },

  parseFiles: function (files, options) {

    var id = options.id;
    var root = (options && options.root) || new Directory('');

    files.forEach(function (file) {
      file = new File(file[id], file);
      root.contents.push(file);
    });

    return sortContents(root);
  }

};

module.exports = RangerUtils;
