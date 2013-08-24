(function () {

  var Base, template;
  Base = require('base');

  template = "<div class=\"title\">{{ title }}</div>\n<div class=\"items\"></div>";
  module.exports = new Base.View(template, true);

}());
