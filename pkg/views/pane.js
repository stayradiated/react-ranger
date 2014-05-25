/** @jsx React.DOM */
var React = require('react');
var Directory = require('./directory');
var File = require('./file');

var Pane = React.createClass({displayName: 'Pane',

  render: function () {
    var contents = this.props.contents.map(function (item, i) {
      if (item.type === 'directory') {
        return Directory( {key:i, item:item} );
      } else {
        return File( {key:i, item:item} );
      }
    });

    return (
      React.DOM.div( {className:"pane"}, 
        contents
      )
    );
  }

});

module.exports = Pane;
