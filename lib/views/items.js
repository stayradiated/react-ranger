'use strict';

var Base, Items, template, vent;

Base = require('base');

// Set globals
module.exports = function (vnt, tmpl) {
  if (vent === undefined) { vent = vnt; }
  if (template === undefined) { template = tmpl; }
  return Items;
};

Items = Base.View.extend({

  tagName: 'div',
  className: 'item',

  events: {
    'mousedown': 'click'
  },

  constructor: function () {
    Items.__super__.constructor.apply(this, arguments);

    this.click = this.click.bind(this);

    this.el = $("<" + this.tagName + " class=\"" + this.className + "\">");
    this.bind();

    this.listen([
      this.item, {
        'select': this.select.bind(this),
        'change:child': this.render.bind(this)
      },
      this.item.collection, {
        'remove': this.release.bind(this)
      }
    ]);
  },

  render: function () {
    this.el.html(template(this.item.toJSON()));
    this.el.toggleClass('hasChild', !! this.item.child);
    return this;
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

