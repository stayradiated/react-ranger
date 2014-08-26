'use strict';

var $ = require('jquery');
var React = require('react');
var Ranger = require('../lib');

$(function () {
  var store = Ranger.createStore(null, function (item) {
      console.log('opening', item);
  });

  React.renderComponent(new Ranger({ store: store }), document.body);

  $.get('files.json').then(function (content) {
    store.setRootDir(Ranger.parseList(content));
  });
});
