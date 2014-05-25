var Path = require('path');
var Ranger = require('./views/ranger');

module.exports = Ranger;

var mkdir = function (list, name) {

  // Look for existing directorys
  for (var i = 0, len = list.length; i < len; i++) {
    var item = list[i];
    if (item.type === 'directory' && item.name === name) {
      return item.contents;
    }
  }

  return list;
};

Ranger.parseList = function (list) {

  var output = [];
  var isDirectory = /\/$/m;

  list.forEach(function (fullPath) {
    console.log(fullPath);

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

    console.log(item.type, path);

    for (var i = 0, len = path.length - 1; i < len; i++) {
      console.log(path[i]);
      parent = mkdir(parent, path[i]);
    }

    parent.push(item);
  });

  return output;

};
