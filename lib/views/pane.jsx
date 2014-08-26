'use strict';

var React = require('react/addons');

var ItemList = require('./itemList');
var FileModel = require('../models/file');
var DirectoryModel = require('../models/directory');

var Pane = React.createClass({

  propTypes: {
    store: React.PropTypes.any.isRequired,
    type: React.PropTypes.string.isRequired,
    active: React.PropTypes.oneOfType([
      React.PropTypes.instanceOf(DirectoryModel),
      React.PropTypes.instanceOf(FileModel),
      React.PropTypes.bool,
    ])
  },

  render: function () {
    var list = '';

    if (this.props.item) {
      if (this.props.item instanceof DirectoryModel) {
        list = new ItemList({
          contents: this.props.item.contents,
          active: this.props.active,
          store: this.props.store,
        });
      } else {
        list = new React.DOM.h1(null, this.props.item.name);
      }
    }

    var classes = this.props.type + '-pane pane';

    return (
      /* jshint ignore: start */
      <div className={classes}>
        {list}
      </div>
      /* jshint ignore: end */
    );
  }

});

module.exports = Pane;
