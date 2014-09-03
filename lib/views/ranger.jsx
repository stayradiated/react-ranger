'use strict';

var React = require('react');
var Reflux = require('reflux');

var Directory = require('../models/directory');
var StoreFactory = require('../store');
var Pane = require('./pane');
var utils = require('../utils');

var Ranger = React.createClass({

  statics: {
    createStore: StoreFactory,
    parseList: utils.parseList,
    parseFiles: utils.parseFiles,
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

  handleMouseDown: function (e) {
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

    var active = currentDir.contents.active() || false;
    var directory = currentDir;
    var parent = currentDir.parent;
    var child = (active.contents instanceof Directory) && active.contents.active();

    var panes = [
      /* jshint ignore: start */
      <Pane key='parent' type='parent'
        item={parent}
        active={directory}
        store={this.props.store}
      />,
      <Pane key='active' type='active'
        item={directory}
        active={active}
        store={this.props.store}
      />,
      <Pane key='contents' type='contents'
        item={active}
        active={child}
        store={this.props.store}
        view={this.props.view}
      />
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
  },

  _onChange: function () {
    this.forceUpdate();
  },

});

module.exports = Ranger;
