'use strict';

var React = require('react/addons');

var FileModel = require('../models/file');

var File = React.createClass({

  propTypes: {
    active: React.PropTypes.bool,
    item: React.PropTypes.instanceOf(FileModel).isRequired,
    store: React.PropTypes.any.isRequired,
  },

  getDefaultProps: function () {
    return {
      active: false
    };
  },

  handleClick: function () {
    this.props.store.jumpTo(this.props.item);
  },

  handleDoubleClick: function () { 
    this.props.store.execute();
  },

  render: function () {
    var classes = React.addons.classSet({
      file: true,
      active: this.props.active
    });

    return (
      /* jshint ignore: start */
      <div className={classes}
        onClick={this.handleClick}
        onDoubleClick={this.handleDoubleClick}>
        {this.props.item.name}
      </div>
      /* jshint ignore: end */
    );
  }

});

module.exports = File;
