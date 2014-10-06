'use strict';

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

  it('should push an item', function () {
    itemList.push(file);
    assert.equal(itemList._index, 0);
    assert.deepEqual(itemList.items, [file]);
  });

  it('should get the indexOf an item', function () {
    assert.equal(itemList.indexOf(file), -1);
    itemList.push(file);
    assert.equal(itemList.indexOf(file), 0);
  });

  it('should get an item at an index', function () {
    assert.equal(itemList.at(0), undefined);
    itemList.push(file);
    assert.equal(itemList.at(0), file);
  });

  it('should get the length', function () {
    assert.equal(itemList.length(), 0);
    itemList.push(file);
    assert.equal(itemList.length(), 1);
  });

  it('should get a child by it\'s name', function () {
    assert.equal(itemList.get('file'), undefined);
    itemList.push(file);
    assert.equal(itemList.get('file'), file);
  });

  it('should map', function () {
    var spy = sinon.spy();
    itemList.push(file);
    itemList.map(spy);
    assert.deepEqual(spy.args, [[file, 0, itemList.items]]);
  });

  it('should get the active item', function () {
  });

  it('should select the next item', function () {
    assert.equal(itemList._index, -1);
    itemList.push(file);
    itemList.push(file);
    assert.equal(itemList._index, 0);
    itemList.next();
    assert.equal(itemList._index, 1);
    itemList.next();
    assert.equal(itemList._index, 1);
  });

  it('should select the previous item', function () {
    assert.equal(itemList._index, -1);
    itemList.push(file);
    itemList.push(file);
    assert.equal(itemList._index, 0);
    itemList.prev();
    assert.equal(itemList._index, 0);
    itemList.next();
    assert.equal(itemList._index, 1);
    itemList.prev();
    assert.equal(itemList._index, 0);
  });

  it('should select an item', function () {
    assert.equal(itemList._index, -1);
    itemList.push(file);
    itemList.select(file);
    assert.equal(itemList._index, 0);

    var nextFile = new File('next');
    itemList.push(nextFile);
    itemList.select(nextFile);
    assert.equal(itemList._index, 1);
  });

});
