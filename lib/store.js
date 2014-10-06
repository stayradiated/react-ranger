'use strict';

var _ = require('lodash');
var Reflux = require('reflux');
var File = require('./models/file');
var Directory = require('./models/directory');

var StoreFactory = function (rootDir, onExecute) {
  rootDir = rootDir || new Directory('');
  onExecute = onExecute || _.noop;

  var state = {
    currentDir: rootDir,
    rootDir: rootDir,
    onExecute: onExecute,
  };

  var Store = Reflux.createStore({

    /** DIRECTORIES **/

    getCurrentDir: function () {
      return state.currentDir;
    },

    getRootDir: function () {
      return state.rootDir;
    },

    setRootDir: function (rootDir) {
      state.rootDir = rootDir;
      state.currentDir = rootDir;
      this.trigger();
    },

    /*
     * ACTIONS
     */

    up: function () {
      state.currentDir.contents.prev();
      this.trigger();
    },

    down: function () {
      state.currentDir.contents.next();
      this.trigger();
    },

    openDirectory: function () {
      var active = state.currentDir.contents.active();
      if (! (active instanceof Directory)) { return; }
      state.currentDir = active;
      this.trigger();
    },

    openParent: function () {
      if (! state.currentDir.parent) { return; }
      state.currentDir = state.currentDir.parent;
      this.trigger();
    },

    execute: function () {
      var active = state.currentDir.contents.active();
      if (! active) { return; }
      if (active instanceof File) {
        state.onExecute(active);
      } else {
        this.openDirectory();
      }
    },

    jumpTo: function (item) {
      state.currentDir = item.parent;
      state.currentDir.contents.select(item);
      this.trigger();
    }

  });

  return Store;
};

module.exports = StoreFactory;
