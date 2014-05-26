/** @jsx React.DOM */
var React = require('react/addons');
var classSet = React.addons.classSet;

var File = React.createClass({displayName: 'File',

  render: function () {
    var classes = classSet({
      file: true,
      active: this.props.active
    });

    return (
      React.DOM.div( {className:classes}, 
        this.props.item.name
      )
    );
  }

});

module.exports = File;
