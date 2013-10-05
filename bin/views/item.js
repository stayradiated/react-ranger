(function () {

  var Base, template;
  Base = window.Base = require('base');

  template = "{{ name }}";
  module.exports = new Base.View(template, true);

}());
