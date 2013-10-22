/*jslint browser: true, node: true, nomen: true*/
(function () {
    'use strict';

    var Pane, Base = require('base');

    Pane = Base.Model.extend({

        defaults: {
            key: '',
            title: '',
            contents: null
        },

        constructor: function (attrs) {
            Pane.__super__.constructor.apply(this, arguments);

            var ItemCollection = require('../models/item');
            this.contents = new ItemCollection();

            if (attrs && attrs.contents) {
                this.contents.refresh(attrs.contents, true);
            }

            this.on('refresh', function(self) {
                self.contents = new ItemCollection();
            });
        }

    });

    module.exports = Pane;

}());
