'use strict';

var sinon = require('sinon');
var assert = require('chai').assert;
var Directory = require('../../lib/models/directory');
var ItemList = require('../../lib/models/itemList');
var File = require('../../lib/models/file');

describe('directory', function () {

  it('should create a new instance', function () {
    var dir = new Directory('folder');
    assert.equal(dir.name, 'folder');
    assert.equal(dir.path, 'folder/');
    assert.equal(dir.parent, null);
    assert(dir.contents instanceof ItemList);
  });

  it('should set the parent', function () {
    var child = new Directory('child');
    var parent = new Directory('parent');
    assert.equal(child.path, 'child/');

    // set child.parent as parent
    child.setParent(parent);
    assert.equal(child.parent, parent);
    assert.equal(child.path, 'parent/child/');
  });

  it('should listen to this.contents for _onPush', function () {
    var dir = new Directory('root');
    var item = new File('file');
    var spy = sinon.stub(item, 'setParent');

    // push item to dir
    dir.contents.push(item);
    assert(spy.calledOnce);
    assert.deepEqual(spy.args, [[dir]]);
  });

});
