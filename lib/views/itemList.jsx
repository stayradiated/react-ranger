var _ = require('lodash');
var React = require('react');
var File = require('./file');
var Directory = require('./directory');
var DirectoryModel = require('../models/directory');

var ItemList = React.createClass({

  render: function () {
    var contents = '';

    if (this.props.contents && this.props.contents.length) {
      contents = this.props.contents.map(function (item, i) {
        var isActive = (item === this.props.active);
        if (item instanceof DirectoryModel) {
          return <Directory key={i} item={item} active={isActive} />;
        } else {
          return <File key={i} item={item} active={isActive} />;
        }
      }, this);
    }

    return (
      <div className='item-list'>
        {contents}
      </div>
    );
  }

});

module.exports = ItemList;
