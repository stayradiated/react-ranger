var _ = require('lodash');
var Path = require('path');
var Ranger = require('./views/ranger');

module.exports = Ranger;

var sortContents = function (list) {
  list.contents = _.sortBy(list.contents, ['type', 'name']);
  list.contents.forEach(function (item) {
    if (item.type === 'directory') {
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
    if (item.type === 'directory' && item.name === name) {
      return item;
    }
  }

  return list;
};

Ranger.parseList = function (list) {

  var isDirectory = /\/$/m;

  var output = {
    path: '',
    name: '/',
    type: 'directory',
    contents: []
  };

  list.forEach(function (fullPath) {

    var item = {
      name: Path.basename(fullPath)
    };

    if (isDirectory.test(fullPath)) {
      fullPath = fullPath.slice(0, -1);
      item.type = 'directory';
      item.contents = [];
    } else {
      item.type = 'file';
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
