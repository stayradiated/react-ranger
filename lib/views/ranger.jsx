'use strict';

var React = require('react');
var Reflux = require('reflux');

var DirectoryModel = require('../models/directory');
var FileModel      = require('../models/file');
var StoreFactory   = require('../store');
var utils          = require('../utils');

var Pane           = require('./pane');
var Status         = require('./status');

var Ranger = React.createClass({

  statics: {
    createStore: StoreFactory,
    parseList: utils.parseList,
    parseFiles: utils.parseFiles,
    File: FileModel,
    Directory: DirectoryModel,
  },

  mixins: [Reflux.ListenerMixin],

  propTypes: {
    store: React.PropTypes.any.isRequired,
    view: React.PropTypes.any.isRequired,
  },

  getInitialState: function () {
    return {
      hasFocus: false,
    };
  },

  componentDidMount: function () {
    this.listenTo(this.props.store, this._onChange);
  },

  componentDidUpdate: function () {
    var el = this.refs.container.getDOMNode();
    el.scrollLeft = el.scrollWidth;
  },

  focus: function (e) {
    e.preventDefault();
    this.refs.input.getDOMNode().focus();
  },

  handleFocus: function () {
    this.setState({
      hasFocus: true
    });
  },

  handleBlur: function () {
    this.setState({
      hasFocus: false
    });
  },

  handleKeyDown: function (e) {
    switch (e.keyCode) {
      case 8:  // backspace
      case 37: // left
      case 72: // h
        this.props.store.openParent();
        break;

      case 38: // up
      case 75: // k
        this.props.store.up();
        break;

      case 39: // right
      case 76: // l
        this.props.store.openDirectory();
        break;

      case 40: // down
      case 74: // j
        this.props.store.down();
        break;

      case 13: // enter
        this.props.store.execute();
        break;

      default:
        return true;
    }

    e.preventDefault();
    return false;
  },

  render: function () {
    var currentDir = this.props.store.getCurrentDir();

    var directory = currentDir;
    var active = currentDir.contents.active() || false;
    var child = (active.contents instanceof DirectoryModel) && active.contents.active();

    var panes = [];

    panes.push(
      <Pane
        key={directory.path}
        item={directory}
        active={active}
        store={this.props.store}
      />
    );

    if (active) {
      panes.push(
        <Pane
          key={active.path}
          item={active}
          active={child}
          store={this.props.store}
          view={this.props.view}
        />
      );
    }

    var dir = currentDir;
    while (dir.parent) {
      panes.unshift(
        <Pane key={dir.parent.path}
          item={dir.parent}
          active={dir}
          store={this.props.store}
        />
      );
      dir = dir.parent;
    }

    var classes = React.addons.classSet({
      'ranger': true,
      'focus': this.state.hasFocus,
    });

    return (
      <div tabIndex='-1' className={classes} onFocus={this.focus} onMouseDown={this.focus}>
        <div ref='container' className='pane-container'>
          {panes}
        </div>
        <Status item={active || currentDir} />
        <input type='text' ref='input'
          onKeyDown={this.handleKeyDown}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
        />
      </div>
    );
  },

  _onChange: function () {
    this.forceUpdate();
  },

});

module.exports = Ranger;
