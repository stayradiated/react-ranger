'use strict';

var React = require('react/addons');

var ItemList = require('./itemList');
var FileModel = require('../models/file');
var DirectoryModel = require('../models/directory');

var Pane = React.createClass({

  propTypes: {
    store: React.PropTypes.any.isRequired,
    active: React.PropTypes.oneOfType([
      React.PropTypes.instanceOf(DirectoryModel),
      React.PropTypes.instanceOf(FileModel),
      React.PropTypes.bool,
    ]),
    view: React.PropTypes.any,
  },

  render: function () {
    var list = '';

    if (this.props.item) {
      if (this.props.item instanceof DirectoryModel) {
        list = <ItemList
          contents={this.props.item.contents}
          active={this.props.active}
          store={this.props.store}
        />;
      } else {
        if (this.props.view) {
          list = <this.props.view item={this.props.item} />;
        } else {
          list = this.props.item.name;
        }
      }
    }

    return (
      <div className='pane'>
        {list}
      </div>
    );
  }

});

module.exports = Pane;
