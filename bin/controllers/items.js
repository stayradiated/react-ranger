(function () {

  var Base, Items, template, vent,
    bind = function (fn, me){ return function (){ return fn.apply(me, arguments); }; };

  Base = require('base');

  // Set globals
  module.exports = function (vnt, tmpl) {
    if (vent === undefined) { vent = vnt; }
    if (template === undefined) { template = tmpl; }
    window.TEMPLATE = template;
    return Items;
  };

  Items = Base.Controller.extend({

    tagName: 'div',
    className: 'item',

    events: {
      'mousedown': 'click'
    },

    constructor: function () {

      this.select = bind(this.select, this);
      this.click  = bind(this.click, this);
      this.remove = bind(this.remove, this);
      this.render = bind(this.render, this);
      Items.__super__.constructor.apply(this, arguments);

      this.el = $("<" + this.tagName + " class=\"" + this.className + "\">");
      this.bind();

      this.listen(this.item, {
        'select': this.select
      });

      this.listen(this.item.collection, {
        'remove': this.remove
      });

      this.el.toggleClass('hasChild', !!this.item.child);

    },

    render: function () {
      this.el.html(template.render(this.item.toJSON()));
      return this;
    },

    remove: function () {
      this.unbind();
      this.el.remove();
      delete this.el;
      this.unlisten();
    },

    // Sending message to pane view
    click: function () {
      this.item.collection.trigger('click:item', this.item);
    },

    // Receiving message from pane view
    select: function () {
      this.el.addClass('active');
    }

  });

}());
