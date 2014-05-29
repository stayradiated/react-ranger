var $ = require('jquery');
var _ = require('lodash');
var React = require('react');
var Pane = require('./pane');
var File = require('../models/file');
var Directory = require('../models/directory');

var Ranger = React.createClass({

  getDefaultProps: function () {
    return {
      data: null,
      onExecute: _.noop
    };
  },

  getInitialState: function () {
    return {
      index: 0,
      directory: this.props.data
    };
  },

  focus: function () {
    $(this.refs.input.getDOMNode()).focus();
  },

  handleKeyDown: function (e) {
    switch (e.keyCode) {
      case 8:  // backspace
      case 37: // left
      case 72: // h
        this.out();
        break;

      case 38: // up
      case 75: // k
        this.up();
        break;

      case 39: // right
      case 76: // l
        this.into();
        break;

      case 40: // down
      case 74: // j
        this.down();
        break;

      case 13: // enter
        this.execute();
        break;
    }
  },

  getActive: function () {
    return this.state.directory.contents.at(this.state.index);
  },

  up: function () {
    this.setState({
      index: Math.max(this.state.index - 1, 0)
    });
  },

  down: function () {
    this.setState({
      index: Math.min(this.state.index + 1, this.state.directory.contents.max())
    });
  },

  into: function () {
    var active = this.getActive();
    if (! (active instanceof Directory)) return;
    this.setState({
      index: 0,
      directory: active
    });
  },

  out: function () {
    if (! this.state.directory.parent) return;
    this.setState({
      index: this.state.directory.parent.contents.indexOf(this.state.directory),
      directory: this.state.directory.parent
    });
  },

  execute: function () {
    var active = this.getActive();
    if (! active) return;
    if (active instanceof File) {
      this.props.onExecute(active);
    } else {
      this.into();
    }
  },

  render: function () {
    var active = this.getActive() || {};
    var directory = this.state.directory;
    var parent = this.state.directory.parent;

    var panes = [
      <Pane key='ParentPane' type='parent' item={parent} active={directory} />,
      <Pane key='ActivePane' type='active' item={directory} active={active} />,
      <Pane key='ContentsPane' type='contents' item={active} />
    ];

    return (
      <div className='ranger' onClick={this.focus}>
        {panes}
        <input type='text' ref='input' onKeyDown={this.handleKeyDown} />
      </div>
    );
  }

});

module.exports = Ranger;
