'use strict';

var _ = require('lodash');
var React = require('react');

var File = require('./file');
var Directory = require('./directory');

var FileModel = require('../models/file');
var DirectoryModel = require('../models/directory');
var ItemListModel = require('../models/itemList');

var ItemList = React.createClass({

  propTypes: {
    store: React.PropTypes.any.isRequired,
    contents: React.PropTypes.instanceOf(ItemListModel).isRequired,
    active: React.PropTypes.oneOfType([
      React.PropTypes.instanceOf(DirectoryModel),
      React.PropTypes.instanceOf(FileModel),
      React.PropTypes.bool,
    ]).isRequired,
  },

  componentDidUpdate: function() {
    if (! this.refs.active) { return; }
    var active = this.refs.active.getDOMNode();
    var node = this.getDOMNode();

    node.scrollTop = active.offsetTop - (node.offsetHeight / 2);

  },

  render: function () {
    var contents = '';

    if (this.props.contents && this.props.contents.length) {
      contents = this.props.contents.map(function (item, i) {
        var isActive = (item === this.props.active);

        var options = {
          key: i,
          item: item,
          active: isActive,
          store: this.props.store
        };

        if (isActive) {
          options.ref = 'active';
        }

        if (item instanceof DirectoryModel) {
          return new Directory(options);
        } else {
          return new File(options);
        }
      }, this);
    }

    return (
      /* jshint ignore: start */
      <div className='item-list'>{contents}</div>
      /* jshint ignore: end */
    );
  }

});

module.exports = ItemList;
