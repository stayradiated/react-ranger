/** @jsx React.DOM */
var React = require('react');

var Directory = React.createClass({displayName: 'Directory',

  render: function () {
    return (
      React.DOM.div( {className:"directory"}, 
        this.props.item.name
      )
    );
  }

});

module.exports = Directory;
