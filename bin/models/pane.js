(function () {

  var Base, Item, Pane, Panes, _ref;

  Base = require('base');
  Item = require('../models/item');

  Pane = Base.Model.extend({

    defaults: {
      title: '',
      contents: []
    },

   constructor: function (attrs) {
      Pane.__super__.constructor.apply(this, arguments);
      this.contents = new Item();
      this.contents.refresh(attrs.contents, true);
    }

  });

  Panes = Base.Collection.extend({

    constructor: function () {
      _ref = Panes.__super__.constructor.apply(this, arguments);
      return _ref;
    },

    model: Pane

  });

  module.exports = Panes;

}());
