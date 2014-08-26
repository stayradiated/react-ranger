'use strict';

var React = require('react/addons');

var DirectoryModel = require('../models/directory');

var Directory = React.createClass({

  propTypes: {
    active: React.PropTypes.bool,
    item: React.PropTypes.instanceOf(DirectoryModel).isRequired,
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

  render: function () {
    var classes = React.addons.classSet({
      directory: true,
      active: this.props.active
    });

    return (
      /* jshint ignore: start */
      <div className={classes} onClick={this.handleClick}>
        {this.props.item.name}
      </div>
      /* jshint ignore: end */
    );
  }

});

module.exports = Directory;
