var assert = require('chai').assert;
var File = require('../../lib/models/file');
var Directory = require('../../lib/models/directory');

describe('file', function () {

  it('should create a new instance', function () {
    var file = new File('file');
    assert.equal(file.name, 'file');
    assert.equal(file.name, 'file');
    assert.equal(file.parent, null);
  });

  it('should set the file parent', function () {
    var file = new File('file');
    var dir = new Directory('root');

    file.setParent(dir);
    assert.equal(file.parent, dir);
    assert.equal(file.path, 'root/file');
  });

});
