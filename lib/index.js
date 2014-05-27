var _ = require('lodash');
var Path = require('path');
var Ranger = require('./views/ranger');
var ItemConstants = require('./constants/item');

module.exports = Ranger;

var sortContents = function (list) {
  list.contents = _.sortBy(list.contents, ['type', 'name']);
  list.contents.forEach(function (item) {
    if (item.type === ItemConstants.DIRECTORY) {
      sortContents(item);
    }
  });
  return list;
};

var mkdir = function (list, name) {
  var contents = list.contents;

  // Look for existing directorys
  for (var i = 0, len = contents.length; i < len; i++) {
    var item = contents[i];
    if (item.type === ItemConstants.DIRECTORY && item.name === name) {
      return item;
    }
  }

  var dir = {
    name: name,
    type: ItemConstants.DIRECTORY,
    path: list.path + '/' + name,
    parent: list,
    contents: []
  };

  console.log(dir);

  list.contents.push(dir);
  return dir;
};

Ranger.parseList = function (list) {

  var isDirectory = /\/$/m;

  var output = {
    path: '',
    name: '/',
    type: ItemConstants.DIRECTORY,
    contents: []
  };

  list.forEach(function (fullPath) {

    var item = {
      name: Path.basename(fullPath)
    };

    if (isDirectory.test(fullPath)) {
      fullPath = fullPath.slice(0, -1);
      item.type = ItemConstants.DIRECTORY;
      item.contents = [];
    } else {
      item.type = ItemConstants.FILE;
    }

    var path = fullPath.split(Path.sep);
    var parent = output;

    for (var i = 0, len = path.length - 1; i < len; i++) {
      parent = mkdir(parent, path[i]);
    }

    item.path = parent.path + '/' + item.name;
    item.parent = parent;

    parent.contents.push(item);
  });

  output.path = '/';

  return sortContents(output);

};
