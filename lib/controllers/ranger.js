/*jslint browser: true, node: true, nomen: true*/
/*global $*/

(function () {

    'use strict';

    var Base, Item, Items, Pane, Panes, Ranger, template, vent, bind;

    Base = require('base');
    bind = require('../common').bind;

    // Global event passer
    vent = new Base.Event();

    // Templates
    template = {
        pane: require('../views/pane'),
        item: require('../views/item')
    };

    // Controllers and Models
    Panes = require('../controllers/panes')(vent, template.pane);
    Items = require('../controllers/items')(vent, template.item);
    Pane  = require('../models/pane');
    Item  = require('../models/item');

    Ranger = Base.Controller.extend({

        constructor: function () {

            this.open        = bind(this.open, this);
            this.left        = bind(this.left, this);
            this.right       = bind(this.right, this);
            this.down        = bind(this.down, this);
            this.up          = bind(this.up, this);
            this.selectFirst = bind(this.selectFirst, this);
            this.loadRaw     = bind(this.loadRaw, this);
            this.remove      = bind(this.remove, this);
            this.addOne      = bind(this.addOne, this);
            this.recheck     = bind(this.recheck, this);
            this.selectItem  = bind(this.selectItem, this);
            this.selectPane  = bind(this.selectPane, this);
            Ranger.__super__.constructor.apply(this, arguments);

            this.current = {
                pane: null,
                item: null
            };

            this.panes = new Pane();
            this.panes.on('create:model show', this.addOne);
            this.panes.on('before:destroy:model', this.remove);

            vent.on('select:item', this.selectItem);
            vent.on('select:pane', this.selectPane);

        },

        // Select a pane
        selectPane: function (pane) {
            this.current.pane = pane;
            this.el.find('.active.pane').removeClass('active');
        },

        // Select an item
        selectItem: function (item, pane) {
            this.current.item = item;
            this.recheck(pane);
            if (!item.child) {
                return;
            }
            this.panes.trigger('show', item.child);
        },

        // Remove panes that aren't displayed
        recheck: function (pane) {
            var _this = this;
            return pane.contents.forEach(function (item) {
                if (!item.child) {
                    return;
                }
                item.child.trigger('remove');
                _this.recheck(item.child);
            });
        },

        // Render a pane
        addOne: function (pane) {
            var view;
            view = new Panes({
                pane: pane
            });
            this.el.append(view.render().el);
        },

        // Destroying the view of a pane when the model is destroyed
        // Also destroy all child views
        remove: function (pane) {
            pane.trigger('remove');
            this.recheck(pane);
        },

        // Load an array of objects
        loadRaw: function (array, panes) {
            var i, id, item, key, length, main, map, out, title, x, _base, j, alen, plen;

            // You can only have one top level pane at a time
            if (this.panes.length > 0) {
                this.panes.get(0).destroy();
            }

            map    = {};
            main   = {};
            length = panes.length - 1;

            for (i = 0, alen = array.length; i < alen; i += 1) {

                item = array[i];
                out  = main;
                x    = '';

                for (j = 0, plen = panes.length; j < plen; j += 1) {

                    title = panes[j][0];
                    key   = panes[j][1];

                    out.title = title;
                    if (out.contents === undefined) {
                        out.contents = [];
                    }

                    x += title + ':' + item[key] + ':';

                    if (map[x] === undefined) {
                        id = out.contents.push({
                            title: item[key]
                        }) - 1;
                        map[x] = out.contents[id];
                    }

                    if (j !== length) {

                        if (map[x].child !== undefined) {
                            out = map[x].child;
                        } else {
                            out = map[x].child = {};
                        }

                    } else {
                        map[x].data = item;
                    }
                }
            }
            this.panes.create(main);
        },

        // Select the first item in the first pane
        selectFirst: function () {
            var item, pane;
            pane = this.panes.first();
            item = pane.contents.first();
            pane.contents.trigger('click:item', item);
        },

        // Move up
        up: function () {
            if (!this.current.pane) {
                return this.selectFirst();
            }
            this.current.pane.trigger('move:up');
        },

        // Move down
        down: function () {
            if (!this.current.pane) {
                return this.selectFirst();
            }
            this.current.pane.trigger('move:down');
        },

        // Move right
        right: function () {
            if (!this.current.pane) {
                return;
            }
            this.current.pane.trigger('move:right');
        },

        // Move left
        left: function () {
            var item, pane, _ref;
            if (!((_ref = this.current.pane) !== undefined ? _ref.parent : undefined)) {
                return;
            }
            item = this.current.pane.parent;
            pane = item.collection;
            pane.trigger('click:item', item);
        },

        // Return the selcted item
        open: function () {
            return this.current.item.data;
        }

    });

    // Export global if we are running in a browser
    if (typeof process === 'undefined' || process.title === 'browser') {
        window.Ranger = Ranger;
    }

    module.exports = Ranger;

}());
