'use strict';

var $ = require('jquery');
var React = require('react');
var Ranger = require('../lib');

$(function () {
  var store = Ranger.createStore(null, function (item) {
      console.log('opening', item);
  });

  var ItemView = React.createClass({
    render: function () {
      return (
        <div>
          <p><strong>Name:</strong> {this.props.item.name}</p>
          <p><strong>Path:</strong> {this.props.item.path}</p>
          <p><strong>Contents:</strong> {this.props.item.contents}</p>
        </div>
      );
    }
  });

  React.render(<Ranger store={store} view={ItemView} />, document.body);

  $.get('files.json').then(function (content) {
    store.setRootDir(Ranger.parseList(content));
  });
});
