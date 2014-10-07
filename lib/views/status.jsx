'use strict';

var React = require('react/addons');

var FileModel = require('../models/file');
var DirectoryModel = require('../models/directory');

var Status = React.createClass({

  propTypes: {
    item: React.PropTypes.oneOfType([
      React.PropTypes.instanceOf(DirectoryModel),
      React.PropTypes.instanceOf(FileModel),
    ]).isRequired,
  },

  render: function () {
    return (
      /* jshint ignore: start */
      <div className='status'>
        {this.props.item.path}
      </div>
      /* jshint ignore: end */
    );
  }

});

module.exports = Status;
