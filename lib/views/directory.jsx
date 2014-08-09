var React = require('react/addons');
var classSet = React.addons.classSet;

var DirectoryModel = require('../models/directory');

var Directory = React.createClass({

  propTypes: {
    active: React.PropTypes.bool,
    item: React.PropTypes.instanceOf(DirectoryModel).isRequired
  },

  getDefaultProps: function () {
    return {
      active: false
    };
  },

  render: function () {
    var classes = classSet({
      directory: true,
      active: this.props.active
    });

    return (
      /* jshint ignore: start */
      <div className={classes}>
        {this.props.item.name}
      </div>
      /* jshint ignore: end */
    );
  }

});

module.exports = Directory;
