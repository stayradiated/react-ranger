/** @jsx React.DOM */
var React = require('react');
var Pane = require('./pane');

var Ranger = React.createClass({displayName: 'Ranger',

  render: function () {
    console.log(JSON.stringify(this.props.data, null, 2));
    return (
      React.DOM.div( {className:"ranger"}, 
        Pane(null ),
        Pane(null ),
        Pane(null )
      )
    );
  }

});

module.exports = Ranger;
tem: require('../templates/item')
    };

    // Intialise views
    PaneView = require('../views/panes')(vent, template.pane);
    ItemView = require('../views/items')(vent, template.item);

    // Models
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

            this.pane = new Pane();
            this.pane.on('refresh', this.addOne);
            this.pane.on('before:destroy', this.remove);

            vent.on('select:item', this.selectItem);
            vent.on('select:pane', this.selectPane);
            vent.on('show:pane', this.addOne);

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
            vent.trigger('show:pane', item.child);
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
            var view = new PaneView({
                pane: pane
            });
            this.el.append(view.render().el);
        },

        // Destroying the view of a pane when the model is destroyed
        // Also destroy all child views
        remove: function (pane) {
            console.log('removing a pane', pane);
            pane.trigger('remove');
            this.recheck(pane);
        },

        // Select the first item in the first pane
        selectFirst: function () {
            var item = this.pane.contents.first();
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
