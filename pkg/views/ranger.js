/** @jsx React.DOM */
var React = require('react');
var Pane = require('./pane');
var $ = require('jquery');

var Ranger = React.createClass({displayName: 'Ranger',

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
        this.out();
        break;
      case 38: // up
        this.up();
        break;
      case 39: // right
        this.into();
        break;
      case 40: // down
        this.down();
        break;
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
    if (! active || active.type !== 'directory') return;
    this.setState({
      index: 0,
      directory: active
    });
  },

  out: function () {
    if (! this.state.directory.parent) return;
    this.setState({
      directory: this.state.directory.parent
    });
  },


  render: function () {
    var active = this.getActive();
    var directory = this.state.directory;
    var parent = this.state.directory.parent;

    var panes = [
      Pane( {key:directory.path, contents:directory.contents, active:active} )
    ];

    if (parent) {
      panes.unshift(Pane( {key:parent.path, contents:parent.contents} ));
    }

    if (active && active.type === 'directory') {
      panes.push(Pane( {key:active.path, contents:active.contents} ));
    }

    return (
      React.DOM.div( {className:"ranger", onClick:this.focus}, 
        panes,
        React.DOM.input( {type:"text", ref:"input", onKeyDown:this.handleKeyDown} )
      )
    );
  }

});

module.exports = Ranger;
