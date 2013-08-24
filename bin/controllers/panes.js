(function () {

  var Base, Items, Panes, template, vent,
    bind = function (fn, me){ return function (){ return fn.apply(me, arguments); }; };

  Base = require('base');
  Items = require('../controllers/items')();

  // Set globals
  module.exports = function (vnt, tmpl) {
    if (vent === undefined) { vent = vnt; }
    if (template === undefined) { template = tmpl; }
    return Panes;
  };

  Panes = Base.Controller.extend({

    tagName: 'section',
    className: 'pane',

    constructor: function () {

      this.right           = bind(this.right, this);
      this.down            = bind(this.down, this);
      this.up              = bind(this.up, this);
      this.move            = bind(this.move, this);
      this.addOne          = bind(this.addOne, this);
      this.render          = bind(this.render, this);
      this.select          = bind(this.select, this);
      this.updateScrollbar = bind(this.updateScrollbar, this);
      this.remove          = bind(this.remove, this);
      Panes.__super__.constructor.apply(this, arguments);

      this.el = $("<" + this.tagName + " class=\"" + this.className + "\">");
      this.active = null;

      this.listen(this.pane, {
        'remove': this.remove,
        'move:up': this.up,
        'move:down': this.down,
        'move:right': this.right
      });

      this.listen(this.pane.contents, {
        'click:item': this.select
      });

    },

    remove: function () {
      this.pane.contents.trigger('remove');
      this.unbind();
      this.el.remove();
      delete this.el;
      delete this.items;
      this.unlisten();
    },

    updateScrollbar: function () {
      var item, offset, parent, pos, scroll;
      item = this.el.find('.active').get(0);
      parent = this.items.get(0);
      pos = item.offsetTop;
      scroll = parent.scrollTop;
      offset = 200;
      parent.scrollTop = pos - offset;
    },

    select: function (item) {
      vent.trigger('select:pane', this.pane);
      this.active = this.pane.contents.indexOf(item);
      this.el.addClass('active');
      this.el.find('.active').removeClass('active');
      item.trigger('select');
      vent.trigger('select:item', item, this.pane);
      this.updateScrollbar();
    },

    render: function () {
      this.el.html(template.render(this.pane.toJSON()));
      this.items = this.el.find('.items');
      this.pane.contents.forEach(this.addOne);
      return this;
    },

    addOne: function (item) {
      var itemView;
      itemView = new Items({
        item: item
      });
      this.items.append(itemView.render().el);
    },

    move: function (direction) {
      var active, contents, item, max;
      active = this.active;
      contents = this.pane.contents;
      active += direction;
      max = contents.length - 1;

      if (active < 0) {
        active = 0;
      } else if (active > max) {
        active = max;
      }

      if (active === this.active) { return; }

      this.active = active;
      item = contents.get(this.active);
      this.select(item);
    },

    up: function () {
      this.move(-1);
    },

    down: function () {
      this.move(1);
    },

    right: function () {
      var child, current, item;
      current = this.pane.contents.get(this.active);
      if (!current.child) { return; }
      child = current.child.contents;
      item = child.get(0);
      child.trigger('click:item', item);
    }

  });

}());
