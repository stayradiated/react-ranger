var _ = require('lodash');
var React = require('react');

var File = require('./file');
var Directory = require('./directory');
var ItemListModel = require('../models/itemList');
var DirectoryModel = require('../models/directory');

var ItemList = React.createClass({

  propTypes: {
    contents: React.PropTypes.instanceOf(ItemListModel).isRequired
  },

  render: function () {
    var contents = '';

    if (this.props.contents && this.props.contents.length) {
      contents = this.props.contents.map(function (item, i) {
        var isActive = (item === this.props.active);
        if (item instanceof DirectoryModel) {
          return new Directory({key: i, item: item, active: isActive});
        } else {
          return new File({key: i, item: item, active: isActive});
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
