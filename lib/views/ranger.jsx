var $ = require('jquery');
var _ = require('lodash');
var React = require('react');

var Pane = require('./pane');
var File = require('../models/file');
var Directory = require('../models/directory');
var RangerUtils = require('../utils');

var Ranger = React.createClass({

  statics: RangerUtils,

  propTypes: {
    initialDir: React.PropTypes.instanceOf(Directory).isRequired,
    onExecute: React.PropTypes.func
  },

  getDefaultProps: function () {
    return {
      onExecute: _.noop
    };
  },

  getInitialState: function () {
    return {
      directory: this.props.initialDir,
      hasFocus: false,
    };
  },

  handleMouseDown: function (e) {
    e.preventDefault();
    $(this.refs.input.getDOMNode()).focus();
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
        this.openParent();
        break;

      case 38: // up
      case 75: // k
        this.up();
        break;

      case 39: // right
      case 76: // l
        this.openDirectory();
        break;

      case 40: // down
      case 74: // j
        this.down();
        break;

      case 13: // enter
        this.execute();
        break;

      default:
        return true;
    }

    e.preventDefault();
    return false;
  },

  up: function () {
    this.state.directory.contents.prev();
    this.setState({ directory: this.state.directory });
  },

  down: function () {
    this.state.directory.contents.next();
    this.setState({ directory: this.state.directory });
  },

  openDirectory: function () {
    var active = this.state.directory.contents.active();
    if (! (active instanceof Directory)) return;
    this.setState({ directory: active });
  },

  openParent: function () {
    if (! this.state.directory.parent) return;
    this.setState({ directory: this.state.directory.parent });
  },

  execute: function () {
    var active = this.state.directory.contents.active();
    if (! active) return;
    if (active instanceof File) {
      this.props.onExecute(active);
    } else {
      this.openDirectory();
    }
  },

  render: function () {
    var active = this.state.directory.contents.active() || {};
    var directory = this.state.directory;
    var parent = this.state.directory.parent;
    var child = (active.contents instanceof Directory) && active.contents.active();

    var panes = [
      /* jshint ignore: start */
      <Pane key='ParentPane' type='parent' item={parent} active={directory} />,
      <Pane key='ActivePane' type='active' item={directory} active={active} />,
      <Pane key='ContentsPane' type='contents' item={active} active={child} />
      /* jshint ignore: end */
    ];

    var classes = React.addons.classSet({
      ranger: true,
      focus: this.state.hasFocus
    });

    return (
      /* jshint ignore: start */
      <div className={classes} onMouseDown={this.handleMouseDown}>
        {panes}
        <input type='text' ref='input'
          onKeyDown={this.handleKeyDown}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
        />
      </div>
      /* jshint ignore: end */
    );
  }

});

module.exports = Ranger;
