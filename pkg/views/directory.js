/** @jsx React.DOM */
var React = require('react/addons');
var classSet = React.addons.classSet;

var Directory = React.createClass({displayName: 'Directory',

  render: function () {
    var classes = classSet({
      directory: true,
      active: this.props.active
    });

    return (
      React.DOM.div( {className:classes}, 
        this.props.item.name
      )
    );
  }

});

module.exports = Directory;
