var _ = require('lodash');
var React = require('react');
var File = require('./file');
var Directory = require('./directory');
var ItemConstants = require('../constants/item');

var Pane = React.createClass({

  render: function () {
    var contents = 'Empty...';

    if (this.props.contents && this.props.contents.length) {
      contents = this.props.contents.map(function (item, i) {
        var isActive = (item === this.props.active);
        if (item.type === ItemConstants.DIRECTORY) {
          return <Directory key={i} item={item} active={isActive} />;
        } else {
          return <File key={i} item={item} active={isActive} />;
        }
      }, this);
    }

    return (
      <div className={'pane ' + this.props.type}>
        {contents}
      </div>
    );
  }

});

module.exports = Pane;
