/** @jsx React.DOM */
var React = require('react');

var File = React.createClass({displayName: 'File',

  render: function () {
    return (
      React.DOM.div( {className:"file"}, 
        this.props.item.name
      )
    );
  }

});

module.exports = File;
