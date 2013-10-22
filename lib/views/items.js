/*jslint browser: true, node: true, nomen: true*/
/*global $*/

(function () {

    'use strict';

    var Base, Items, template, vent, bindAll;

    Base = require('base');
    bindAll = require('../utils/bind');

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
            bindAll(this);

            this.el = $("<" + this.tagName + " class=\"" + this.className + "\">");
            this.bind();

            this.listen([
                this.item, {
                    'select': this.select,
                    'change:child': this.render
                },
                this.item.collection, {
                    'remove': this.remove
                }
            ]);
        },

        render: function () {
            this.el.html(template(this.item.toJSON()));
            this.el.toggleClass('hasChild', !! this.item.child);
            return this;
        },

        remove: function () {
            this.unbind();
            this.el.remove();
            delete this.el;
            this.stopListening();
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
