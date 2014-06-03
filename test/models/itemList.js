var assert = require('chai').assert;
var sinon = require('sinon');
var ItemList = require('../../lib/models/itemList');
var File = require('../../lib/models/file');

describe('ItemList', function () {

  var itemList, file;

  beforeEach(function () {
    file = new File('file');
    itemList = new ItemList();
  });

  it('should create a new instance', function () {
    assert.deepEqual(itemList.items, []);
    assert.equal(itemList._index, -1);
  });

  it('should add an item', function () {
    itemList.add(file);
    assert.equal(itemList._index, 0);
    assert.deepEqual(itemList.items, [file]);
  });

  it('should get the indexOf an item', function () {
    assert.equal(itemList.indexOf(file), -1);
    itemList.add(file);
    assert.equal(itemList.indexOf(file), 0);
  });

  it('should get an item at an index', function () {
    assert.equal(itemList.at(0), undefined);
    itemList.add(file);
    assert.equal(itemList.at(0), file);
  });

  it('should get the length', function () {
    assert.equal(itemList.length(), 0);
    itemList.add(file);
    assert.equal(itemList.length(), 1);
  });

  it('should map', function () {
    var spy = sinon.spy();
    itemList.add(file);
    itemList.map(spy);
    assert.deepEqual(spy.args, [[file, 0, itemList.items]]);
  });

  it('should get the active item', function () {
  });

  it('should select the next item', function () {
    assert.equal(itemList._index, -1);
    itemList.add(file);
    itemList.add(file);
    assert.equal(itemList._index, 0);
    itemList.next();
    assert.equal(itemList._index, 1);
    itemList.next();
    assert.equal(itemList._index, 1);
  });

  it('should select the previous item', function () {
    assert.equal(itemList._index, -1);
    itemList.add(file);
    itemList.add(file);
    assert.equal(itemList._index, 0);
    itemList.prev();
    assert.equal(itemList._index, 0);
    itemList.next();
    assert.equal(itemList._index, 1);
    itemList.prev();
    assert.equal(itemList._index, 0);
  });

});
