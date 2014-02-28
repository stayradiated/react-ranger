'use strict';

var Base, Items, template, vent;

Base = require('base');

// Set globals
module.exports = function (_vent, _template) {
  if (vent === undefined) vent = _vent;
  if (template === undefined) template = _template;
  return Items;
};

Items = Base.View.extend({

  tagName: 'div',
  className: 'item',

  events: {
    'mousedown': 'click'
  },

  constructor: function () {
    this.click = this.click.bind(this);

    Items.__super__.constructor.apply(this, arguments);

    this.bind($('<' + this.tagName + ' class="' + this.className + '">'));

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

