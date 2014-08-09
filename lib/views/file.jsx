var React = require('react/addons');
var classSet = React.addons.classSet;

var FileModel = require('../models/file');

var File = React.createClass({

  propTypes: {
    active: React.PropTypes.bool,
    item: React.PropTypes.instanceOf(FileModel).isRequired
  },

  getDefaultProps: function () {
    return {
      active: false
    };
  },

  render: function () {
    var classes = classSet({
      file: true,
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

module.exports = File;
