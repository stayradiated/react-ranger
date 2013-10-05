(function () {

  var Base, template;
  Base = window.Base = require('base');

  template = "{{ title }}";
  module.exports = new Base.View(template, true);

}());
