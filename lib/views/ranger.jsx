var React = require('react');
var Pane = require('./pane');
var ItemConstants = require('../constants/item');
var $ = require('jquery');

var Ranger = React.createClass({

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

      default:
        console.log(e.keyCode);
    }
  },

  getActive: function () {
    return this.state.directory.contents[this.state.index];
  },

  up: function () {
    this.setState({
      index: Math.max(this.state.index - 1, 0)
    });
  },

  down: function () {
    this.setState({
      index: Math.min(this.state.index + 1, this.state.directory.contents.length - 1)
    });
  },

  into: function () {
    var active = this.getActive();
    if (! active || active.type !== ItemConstants.DIRECTORY) return;
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


  render: function () {
    var active = this.getActive() || {};
    var directory = this.state.directory;
    var parent = this.state.directory.parent;

    var panes = [];

    if (parent) {
      panes.push(
        <Pane type='parent' key={parent.path} contents={parent.contents} active={active.parent} />
      );
    } else {
      panes.push(
        <Pane type='parent' key='..' />
      );
    }

    panes.push(
      <Pane type='main' key={directory.path} contents={directory.contents} active={active} />
    );

    if (active && active.type === ItemConstants.DIRECTORY) {
      panes.push(
        <Pane type='contents' key={active.path} contents={active.contents} />
      );
    }

    return (
      <div className='ranger' onClick={this.focus}>
        {panes}
        <input type='text' ref='input' onKeyDown={this.handleKeyDown} />
      </div>
    );
  }

});

module.exports = Ranger;
