/*jslint browser: true, node: true, nomen: true*/
/*global $*/

(function () {

    'use strict';

    var Base, Items, bind, Panes, template, vent, SCROLL_OFFSET, SCROLL_HEIGHT;

    Base  = require('base');
    Items = require('../controllers/items')();
    bind  = require('../common').bind;

    // Constants
    // TODO: Let the user set these
    SCROLL_OFFSET = 20;
    SCROLL_HEIGHT = 50;

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

            this.listen([
                this.pane, {
                    'remove':     this.remove,
                    'move:up':    this.up,
                    'move:down':  this.down,
                    'move:right': this.right
                },
                this.pane.contents, {
                    'click:item': this.select
                }
            ]);

        },

        remove: function () {
            this.pane.contents.trigger('remove');
            this.unbind();
            this.el.remove();
            delete this.el;
            delete this.items;
            this.stopListening();
        },

        updateScrollbar: function () {
            var item, parent, height, pos, scroll;
            item   = this.el.find('.active').get(0);
            parent = this.items.get(0);
            height = parent.offsetHeight;
            pos    = item.offsetTop;
            scroll = parent.scrollTop;
            if (pos - scroll < SCROLL_OFFSET) {
                parent.scrollTop = pos - SCROLL_OFFSET;
            } else if (pos + SCROLL_HEIGHT > scroll + height - SCROLL_OFFSET) {
                parent.scrollTop = pos - height + SCROLL_HEIGHT + SCROLL_OFFSET;
            }
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
            this.el.html(template(this.pane.toJSON()));
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
            item = contents.at(this.active);
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
            current = this.pane.contents.at(this.active);
            if (!current.child) { return; }
            child = current.child.contents;
            item = child.first();
            child.trigger('click:item', item);
        }

    });

}());
