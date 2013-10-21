/*jslint browser: true, node: true, nomen: true*/
/*global $*/

(function () {

    'use strict';

    var Base, Item, Items, Pane, Panes, Ranger, template, vent, bindAll;

    Base = require('base');
    bindAll = require('../utils/bind')

    // Global event passer
    vent = new Base.Event();

    // Templates
    template = {
        pane: require('../templates/pane'),
        item: require('../templates/item')
    };

    // Views and Models
    Panes = require('../views/panes')(vent, template.pane);
    Items = require('../views/items')(vent, template.item);
    Pane  = require('../models/pane');
    Item  = require('../models/item');

    Ranger = Base.View.extend({

        constructor: function () {
            Ranger.__super__.constructor.apply(this, arguments);
            bindAll(this);

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

    module.exports = Ranger;

}());
