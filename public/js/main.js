;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
(function(){/*jslint nomen: true*/
/*global window, require, module*/

(function () {
    "use strict";

    var swig, include, extend, inherit, Controller, Event, Model, Collection, View;

    // Use swig for templates
    if (typeof window.swig === 'undefined') {
      swig = require('swig');
    } else {
      swig = window.swig;
    }

    // Copy object properties
    include = function (to, from) {
        var key;
        for (key in from) {
            if (from.hasOwnProperty(key)) {
                to[key] = from[key];
            }
        }
    };

    // CoffeeScript extend for classes
    inherit = function (child, parent) {
        var key, Klass;
        for (key in parent) {
            if (parent.hasOwnProperty(key)) {
                child[key] = parent[key];
            }
        }
        Klass = function () {
            this.constructor = child;
        };
        Klass.prototype = parent.prototype;
        child.prototype = new Klass();
        child.__super__ = parent.prototype;
        return child;
    };

    // Backbone like extending
    extend = function (attrs) {
        var child, parent = this;
        if (!attrs) { attrs = {}; }
        if (attrs.hasOwnProperty('constructor')) {
            child = attrs.constructor;
        } else {
            child = function () {
                child.__super__.constructor.apply(this, arguments);
            };
        }
        inherit(child, parent);
        include(child.prototype, attrs);
        return child;
    };


    /*
     * EVENT
     */

    Event = (function () {

        function Event(attrs) {
            var key;
            this._events = {};
            // Bind events specified in attrs
            if (attrs && attrs.on) {
                for (key in attrs.on) {
                    if (attrs.on.hasOwnProperty(key)) {
                        this.on(key, attrs.on[key]);
                    }
                }
                delete attrs.on;
            }
        }
        
        // Bind an event to a function
        // Returns an event ID so you can unbind it later
        Event.prototype.on = function (events, fn) {
            var ids, id, i, len, event;
            // Allow multiple events to be set at once such as:
            // event.on('update change refresh', this.render);
            ids = [];
            events = events.split(' ');
            for (i = 0, len = events.length; i < len; i += 1) {
                event = events[i];
                // If the event has never been listened to before
                if (!this._events[event]) {
                    this._events[event] = {};
                    this._events[event].index = 0;
                }
                // Increment the index and assign an ID
                id = this._events[event].index += 1;
                this._events[event][id] = fn;
                ids.push(id);
            }
            return ids;
        };

        // Trigger an event
        Event.prototype.trigger = function (event) {
            var args, actions, i;
            // args is a splat
            args = 2 <= arguments.length ? [].slice.call(arguments, 1) : [];
            actions = this._events[event];
            if (actions) {
                for (i in actions) {
                    if (actions.hasOwnProperty(i) && i !== 'index') {
                        actions[i].apply(actions[i], args);
                    }
                }
            }
        };

        // Remove a listener from an event
        Event.prototype.off = function (event, id) {
          delete this._events[event][id];
        };

        return Event;

    }());



    /*
     * CONTROLLER
     */

    Controller = (function () {

        function Controller(attrs) {
            Controller.__super__.constructor.apply(this, arguments);
            if (!this.elements) { this.elements = {}; }
            if (!this.events) { this.events = {}; }
            include(this, attrs);
            if (this.el) { this.bind(); }
            this.listening = [];
        }

        // Load Events
        inherit(Controller, Event);

        Controller.prototype.bind = function (el) {
            var selector, query, action, split, name, event;

            // If el is not specified use this.el
            if (!el) { el = this.el; }

            // Cache elements
            for (selector in this.elements) {
                if (this.elements.hasOwnProperty(selector)) {
                    name = this.elements[selector];
                    this[name] = el.find(selector);
                }
            }

            // Bind events
            for (query in this.events) {
                if (this.events.hasOwnProperty(query)) {
                    action = this.events[query];
                    split = query.indexOf(' ') + 1;
                    event = query.slice(0, split || 9e9);
                    if (split > 0) {
                        selector = query.slice(split);
                        el.on(event, selector, this[action]);
                    } else {
                        el.on(event, this[action]);
                    }
                }
            }

        };

        Controller.prototype.unbind = function(el) {
            var selector, query, action, split, name, event;

            // If el is not specified use this.el
            if (!el) { el = this.el; }

            // Delete elements
            for (selector in this.elements) {
                if (this.elements.hasOwnProperty(selector)) {
                    name = this.elements[selector];
                    delete this[name];
                }
            }

            // Unbind events
            for (query in this.events) {
                if (this.events.hasOwnProperty(query)) {
                    action = this.events[query];
                    split = query.indexOf(' ') + 1;
                    event = query.slice(0, split || 9e9);
                    if (split > 0) {
                        selector = query.slice(split);
                        el.off(event, selector);
                    } else {
                        el.off(event);
                    }
                }
            }

        };

        Controller.prototype.listen = function (model, attrs) {
          var event, ids, listener;
          listener = [model, {}];
          for (event in attrs) {
              if (attrs.hasOwnProperty(event)) {
                  ids = model.on(event, attrs[event]);
                  listener[1][event] = ids;
              }
          }
          this.listening.push(listener);
        };

        Controller.prototype.unlisten = function () {
            var i, len, model, events, event;
            for (i = 0, len = this.listening.length; i < len; i += 1) {
                model = this.listening[i][0];
                events = this.listening[i][1];
                for (event in events) {
                    if (events.hasOwnProperty(event)) {
                        model.off(event, events[event]);
                    }
                }
            }
            this.listening = [];
        };

        return Controller;

    }());


    /*
     * MODEL
     */

    Model = (function () {

        function Model(attrs) {
            var set, get, key, self = this;

            // Call super
            Model.__super__.constructor.apply(this, arguments);

            // Set attributes
            if (!this.defaults) { this.defaults = {}; }
            this._data = {};
            include(this._data, this.defaults);
            include(this._data, attrs);

            set = function (key) {
                // Encapture key
                return function (value) {
                    // Don't do anything if the value doesn't change
                    if (value === self._data[key]) { return; }
                    self._data[key] = value;
                    self.trigger('change:' + key, value);
                };
            };

            get = function (key) {
                // Encapture key
                return function () {
                    return self._data[key];
                };
            };

            for (key in this.defaults) {
                if (this.defaults.hasOwnProperty(key)) {
                    this.__defineSetter__(key, set(key));
                    this.__defineGetter__(key, get(key));
                }
            }

        }

        // Load Events
        inherit(Model, Event);

        // Load data into the model
        Model.prototype.refresh = function (data, replace) {
            if (replace) { this._data = this.defaults; }
            include(this._data, data);
            this.trigger('refresh');
            return this;
        };

        // Destroy the model
        Model.prototype.destroy = function () {
            delete this._data;
            this.trigger('destroy');
            return this;
        };

        // Convert the class instance into a simple object
        Model.prototype.toJSON = function () {
            return this._data;
        };


        return Model;

    }());


    /*
     * COLLECTION
     */

    Collection = (function () {

        function Collection() {
            Collection.__super__.constructor.apply(this, arguments);
            this._records = [];
            this.length = 0;
        }

        // Load Events
        inherit(Collection, Event);

        // Create a new instance of the model and add it to the collection
        Collection.prototype.create = function (attrs, options) {
            var model = new this.model(attrs);
            this.add(model, options);
            return model;
        };

        // Add a model to the collection
        Collection.prototype.add = function (model, options) {

            // Add to collection
            model.collection = this;
            this._records.push(model);
            this.length = this._records.length;
            var self = this;

            // Bubble change event
            model.on('change', function () {
                self.trigger('change:model', model);
            });

            // Bubble destroy event
            model.on('destroy', function () {
                self.trigger('destroy:model', model);
                self.remove(model);
            });

            // Only trigger create if silent is not set
            if (!options || !options.silent) {
              this.trigger('create:model', model);
            }

        };

        // Remove a model from the collection
        // Does not destroy the model - just removes it from the array
        Collection.prototype.remove = function (model) {
            var index = this._records.indexOf(model);
            this._records.splice(index, 1);
            this.length = this._records.length;
            this.trigger('change');
        };

        // Reorder the collection
        Collection.prototype.move = function (record, pos) {
            var index = this._records.indexOf(record);
            this._records.splice(index, 1);
            this._records.splice(pos, 0, record);
            this.trigger('change');
        };

        // Append or replace the data in the collection
        // Doesn't trigger any events when updating the array apart from 'refresh'
        Collection.prototype.refresh = function (data, replace) {
            var i, len, model;
            if (replace) { this._records = []; }
            for (i = 0, len = data.length; i < len; i += 1) {
                this.create(data[i], { silent: true });
            }
            return this.trigger('refresh');
        };

        // Loop over each record in the collection
        Collection.prototype.forEach = function () {
            return Array.prototype.forEach.apply(this._records, arguments);
        };

        // Get the index of the item
        Collection.prototype.indexOf = function() {
            return Array.prototype.indexOf.apply(this._records, arguments);
        };

        // Convert the collection into an array of objects
        Collection.prototype.toJSON = function () {
            var i, len, record, results = [];
            for (i = 0, len = this._records.length; i < len; i += 1) {
                record = this._records[i];
                results.push(record.toJSON());
            }
            return results;
        };

        // Return the first record in the collection
        Collection.prototype.first = function () {
            return this._records[0];
        };

        // Return the last record in the collection
        Collection.prototype.last = function () {
            return this._records[this._records.length - 1];
        };

        // Return a specified record in the collection
        Collection.prototype.get = function (index) {
            return this._records[index];
        };


        return Collection;

    }());


    /*
     * VIEW
     */

    View = (function () {

        function View(template, fromString) {
            this.fromString = fromString;
            if (fromString) {
                this.template = swig.compile(template);
            } else {
                var path = template + '.html';
                this.template = swig.compileFile(path);
            }
        }

        // Expose swig
        View.swig = swig;

        // Render the template
        View.prototype.render = function (data) {
            var html = '';
            if (this.fromString) {
                html = this.template(data);
            } else {
                html = this.template.render(data);
            }
            return html;
        };

        return View;

    }());

    // Add the extend to method to all classes
    Event.extend = Controller.extend = Model.extend = Collection.extend = View.extend = extend;

    // Export all the classes
    module.exports = {
        Event: Event,
        Controller: Controller,
        Model: Model,
        Collection: Collection,
        View: View
    };

}());

})()
},{"swig":2}],2:[function(require,module,exports){
(function(__dirname){module.exports = require(__dirname + '/lib/swig');

})("/../node_modules/base/node_modules/swig")
},{}],3:[function(require,module,exports){
(function() {
  var Base, Items,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Base = require('base');

  Items = (function(_super) {
    __extends(Items, _super);

    Items.prototype.tagName = 'div';

    Items.prototype.className = 'item';

    Items.prototype.events = {
      'mousedown': 'click'
    };

    function Items() {
      this.select = __bind(this.select, this);
      this.click = __bind(this.click, this);
      this.remove = __bind(this.remove, this);
      this.render = __bind(this.render, this);
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
    }

    Items.prototype.render = function() {
      this.el.html(templates.item.render(this.item.toJSON()));
      return this;
    };

    Items.prototype.remove = function() {
      this.unbind();
      this.el.remove();
      delete this.el;
      return this.unlisten();
    };

    Items.prototype.click = function() {
      return this.item.collection.trigger('click:item', this.item);
    };

    Items.prototype.select = function() {
      return this.el.addClass('active');
    };

    return Items;

  })(Base.Controller);

  module.exports = Items;

}).call(this);


},{"base":1}],4:[function(require,module,exports){
(function() {
  var Base, Items, Panes,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Base = require('base');

  Items = require('../controllers/items.coffee');

  Panes = (function(_super) {
    __extends(Panes, _super);

    Panes.prototype.tagName = 'section';

    Panes.prototype.className = 'pane';

    function Panes() {
      this.right = __bind(this.right, this);
      this.down = __bind(this.down, this);
      this.up = __bind(this.up, this);
      this.move = __bind(this.move, this);
      this.addOne = __bind(this.addOne, this);
      this.render = __bind(this.render, this);
      this.select = __bind(this.select, this);
      this.updateScrollbar = __bind(this.updateScrollbar, this);
      this.remove = __bind(this.remove, this);
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
    }

    Panes.prototype.remove = function() {
      this.pane.contents.trigger('remove');
      this.unbind();
      this.el.remove();
      delete this.el;
      delete this.items;
      return this.unlisten();
    };

    Panes.prototype.updateScrollbar = function() {
      var item, offset, parent, pos, scroll;
      item = this.el.find('.active').get(0);
      parent = this.items.get(0);
      pos = item.offsetTop;
      scroll = parent.scrollTop;
      offset = 200;
      return parent.scrollTop = pos - offset;
    };

    Panes.prototype.select = function(item) {
      vent.trigger('select:pane', this.pane);
      this.active = this.pane.contents.indexOf(item);
      this.el.addClass('active');
      this.el.find('.active').removeClass('active');
      item.trigger('select');
      vent.trigger('select:item', item, this.pane);
      return this.updateScrollbar();
    };

    Panes.prototype.render = function() {
      this.el.html(templates.pane.render(this.pane.toJSON()));
      this.items = this.el.find('.items');
      this.pane.contents.forEach(this.addOne);
      return this;
    };

    Panes.prototype.addOne = function(item) {
      var itemView;
      itemView = new Items({
        item: item
      });
      return this.items.append(itemView.render().el);
    };

    Panes.prototype.move = function(direction) {
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
      if (active === this.active) {
        return;
      }
      this.active = active;
      item = contents.get(this.active);
      return this.select(item);
    };

    Panes.prototype.up = function() {
      return this.move(-1);
    };

    Panes.prototype.down = function() {
      return this.move(1);
    };

    Panes.prototype.right = function() {
      var child, current, item;
      current = this.pane.contents.get(this.active);
      if (!current.child) {
        return;
      }
      child = current.child.contents;
      item = child.get(0);
      return child.trigger('click:item', item);
    };

    return Panes;

  })(Base.Controller);

  module.exports = Panes;

}).call(this);


},{"../controllers/items.coffee":3,"base":1}],5:[function(require,module,exports){
(function() {
  var Base, Item, Items, Pane, Panes, Ranger,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Base = require('base');

  Panes = require('../controllers/panes.coffee');

  Items = require('../controllers/items.coffee');

  Pane = require('../models/pane.coffee');

  Item = require('../models/item.coffee');

  Ranger = (function(_super) {
    __extends(Ranger, _super);

    function Ranger() {
      this.left = __bind(this.left, this);
      this.right = __bind(this.right, this);
      this.down = __bind(this.down, this);
      this.up = __bind(this.up, this);
      this.selectFirst = __bind(this.selectFirst, this);
      this.loadRaw = __bind(this.loadRaw, this);
      this.addOne = __bind(this.addOne, this);
      this.recheck = __bind(this.recheck, this);
      this.selectItem = __bind(this.selectItem, this);
      this.selectPane = __bind(this.selectPane, this);
      Ranger.__super__.constructor.apply(this, arguments);
      this.panes = new Pane();
      this.panes.on('create:model show', this.addOne);
      vent.on('select:item', this.selectItem);
      vent.on('select:pane', this.selectPane);
    }

    Ranger.prototype.selectPane = function(pane) {
      this.active = pane;
      return this.el.find('.active.pane').removeClass('active');
    };

    Ranger.prototype.selectItem = function(item, pane) {
      this.recheck(pane);
      if (!item.child) {
        return;
      }
      return this.panes.trigger('show', item.child);
    };

    Ranger.prototype.recheck = function(pane) {
      var _this = this;
      return pane.contents.forEach(function(item) {
        if (!item.child) {
          return;
        }
        item.child.trigger('remove');
        return _this.recheck(item.child);
      });
    };

    Ranger.prototype.addOne = function(pane) {
      var view;
      view = new Panes({
        pane: pane
      });
      return this.el.append(view.render().el);
    };

    Ranger.prototype.loadRaw = function(array, panes) {
      var i, id, item, key, length, main, map, out, title, x, _base, _i, _j, _len, _len1, _ref;
      map = {};
      main = {};
      length = panes.length - 1;
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        item = array[_i];
        out = main;
        x = '';
        for (i = _j = 0, _len1 = panes.length; _j < _len1; i = ++_j) {
          _ref = panes[i], title = _ref[0], key = _ref[1];
          x += title + ':' + item[key] + ':';
          out.title = title;
          if (out.contents == null) {
            out.contents = [];
          }
          if (map[x] === void 0) {
            id = out.contents.push({
              name: item[key]
            }) - 1;
            map[x] = out.contents[id];
          }
          if (i !== length) {
            out = (_base = map[x]).child != null ? (_base = map[x]).child : _base.child = {};
          }
        }
      }
      return this.panes.create(main);
    };

    Ranger.prototype.selectFirst = function() {
      var item, pane;
      pane = this.panes.first();
      item = pane.contents.first();
      return pane.contents.trigger('click:item', item);
    };

    Ranger.prototype.up = function() {
      if (!this.active) {
        return this.selectFirst();
      }
      return this.active.trigger('move:up');
    };

    Ranger.prototype.down = function() {
      if (!this.active) {
        return this.selectFirst();
      }
      return this.active.trigger('move:down');
    };

    Ranger.prototype.right = function() {
      if (!this.active) {
        return;
      }
      return this.active.trigger('move:right');
    };

    Ranger.prototype.left = function() {
      var item, pane, _ref;
      if (!((_ref = this.active) != null ? _ref.parent : void 0)) {
        return;
      }
      item = this.active.parent;
      pane = item.collection;
      return pane.trigger('click:item', item);
    };

    return Ranger;

  })(Base.Controller);

  module.exports = Ranger;

}).call(this);


},{"../controllers/items.coffee":3,"../controllers/panes.coffee":4,"../models/item.coffee":8,"../models/pane.coffee":9,"base":1}],6:[function(require,module,exports){
module.exports=module.exports=[
  {
    "Name": "Chapel Song",
    "AlbumName": "The Art of Flight OST",
    "ArtistName": "We Are Augustines"
  },
  {
    "Name": "Reflection Etrnal",
    "AlbumName": "Modal Soul",
    "ArtistName": "Nujabes"
  },
  {
    "Name": "Nude",
    "AlbumName": "In Rainbows",
    "ArtistName": "Radiohead"
  },
  {
    "Name": "Black Heroes",
    "AlbumName": "LP3",
    "ArtistName": "Ratatat"
  },
  {
    "Name": "Adrift",
    "AlbumName": "Adrift / From Home",
    "ArtistName": "Tycho"
  },
  {
    "Name": "Your Hand in Mine",
    "AlbumName": "The Earth Is Not a Cold Dead Place",
    "ArtistName": "Explosions in the Sky"
  },
  {
    "Name": "Road Trippinâ€™",
    "AlbumName": "Greatest Hits",
    "ArtistName": "Red Hot Chili Peppers"
  },
  {
    "Name": "Starálfur",
    "AlbumName": "Ágætis byrjun",
    "ArtistName": "Sigur Rós"
  },
  {
    "Name": "House of Cards",
    "AlbumName": "In Rainbows",
    "ArtistName": "Radiohead"
  },
  {
    "Name": "Bluebird",
    "AlbumName": "Bluffers Guide, Volume 6 (disc 1: Sunny Side)",
    "ArtistName": "One Self"
  },
  {
    "Name": "Maps",
    "AlbumName": "Fever to Tell",
    "ArtistName": "Yeah Yeah Yeahs"
  },
  {
    "Name": "Que serÃ¡",
    "AlbumName": "Tales of the Forgotten Melodies",
    "ArtistName": "Wax Tailor"
  },
  {
    "Name": "Amber",
    "AlbumName": "From Chaos",
    "ArtistName": "311"
  },
  {
    "Name": "Luv(sic.) Pt. 3 Ft. Shing02",
    "AlbumName": "Modal Soul",
    "ArtistName": "Nujabes"
  },
  {
    "Name": "Sleep Forever",
    "AlbumName": "In the Mountain In the Cloud",
    "ArtistName": "Portugal. The Man"
  },
  {
    "Name": "Funeral",
    "AlbumName": "Band of Horses ",
    "ArtistName": "Band of Horses"
  },
  {
    "Name": "Karma Police",
    "AlbumName": "OK Computer",
    "ArtistName": "Radiohead"
  },
  {
    "Name": "Glósóli",
    "AlbumName": "Takk...",
    "ArtistName": "Sigur Rós"
  },
  {
    "Name": "You Only Live Once",
    "AlbumName": "You Only Live Once",
    "ArtistName": "The Strokes"
  },
  {
    "Name": "No Way",
    "AlbumName": "Passive Me, Aggressive You",
    "ArtistName": "The Naked And Famous"
  },
  {
    "Name": "Thin Line",
    "AlbumName": "Power in Numbers",
    "ArtistName": "Jurassic 5"
  },
  {
    "Name": "I'll Be Here a While",
    "AlbumName": "311",
    "ArtistName": "311"
  },
  {
    "Name": "All My Friends (LCD Soundsystem Cover)",
    "AlbumName": "All My Friends",
    "ArtistName": "Franz Ferdinand"
  },
  {
    "Name": "Float On",
    "AlbumName": "Good News for People Who Love Bad News",
    "ArtistName": "Modest Mouse"
  },
  {
    "Name": "Plastic Beach (Ft. Mick Jones & Paul Simonon)",
    "AlbumName": "Plastic Beach",
    "ArtistName": "Gorillaz"
  },
  {
    "Name": "Dictaphone's Lament",
    "AlbumName": "Sunrise Projector",
    "ArtistName": "Tycho"
  },
  {
    "Name": "Acid Raindrops",
    "AlbumName": "O.S.T.",
    "ArtistName": "People Under the Stairs"
  },
  {
    "Name": "The Good Times Are Killing Me",
    "AlbumName": "Good News for People Who Love Bad News",
    "ArtistName": "Modest Mouse"
  },
  {
    "Name": "These Days",
    "AlbumName": "My Funny Valentine",
    "ArtistName": "Nico"
  },
  {
    "Name": "New Slang",
    "AlbumName": "Garden State",
    "ArtistName": "The Shins"
  },
  {
    "Name": "Closer To The Sun",
    "AlbumName": "Closer to the Sun",
    "ArtistName": "Slightly Stoopid"
  },
  {
    "Name": "15 Step",
    "AlbumName": "2006-06-04: Bank of America Pavilion, Boston, MA, USA",
    "ArtistName": "Radiohead"
  },
  {
    "Name": "Feather",
    "AlbumName": "Modal Soul",
    "ArtistName": "Nujabes"
  },
  {
    "Name": "Loud Pipes",
    "AlbumName": "Ratatat",
    "ArtistName": "Ratatat"
  },
  {
    "Name": "On Melancholy Hill",
    "AlbumName": "Plastic Beach",
    "ArtistName": "Gorillaz"
  },
  {
    "Name": "The Sea",
    "AlbumName": "Big Calm",
    "ArtistName": "Morcheeba"
  },
  {
    "Name": "A Walk",
    "AlbumName": "Dive",
    "ArtistName": "Tycho"
  },
  {
    "Name": "Itszoweezee",
    "AlbumName": "Stakes Is High",
    "ArtistName": "De La Soul"
  },
  {
    "Name": "All Your Light (Times Like These)",
    "AlbumName": "In the Mountain In the Cloud",
    "ArtistName": "Portugal. The Man"
  },
  {
    "Name": "The Adjustor",
    "AlbumName": "One Ten Hundred Thousand Million",
    "ArtistName": "The Octopus Project"
  },
  {
    "Name": "Watermelon Man",
    "AlbumName": "Head Hunters",
    "ArtistName": "Herbie Hancock"
  },
  {
    "Name": "Last Living Souls",
    "AlbumName": "Greatest Hits",
    "ArtistName": "Gorillaz"
  },
  {
    "Name": "world without words",
    "AlbumName": "Samurai Champloo",
    "ArtistName": "Nujabes"
  },
  {
    "Name": "Tobacco Road",
    "AlbumName": "Tobacco Road",
    "ArtistName": "Common Market"
  },
  {
    "Name": "Past Is Prologue",
    "AlbumName": "Sunrise Projector",
    "ArtistName": "Tycho"
  },
  {
    "Name": "So American",
    "AlbumName": "In the Mountain In the Cloud",
    "ArtistName": "Portugal. The Man"
  },
  {
    "Name": "The Wiz",
    "AlbumName": "Fun DMC",
    "ArtistName": "People Under the Stairs"
  },
  {
    "Name": "Sleeping Lessons",
    "AlbumName": "Wincing the Night Away",
    "ArtistName": "The Shins"
  },
  {
    "Name": "Coastal Brake",
    "AlbumName": "Coastal Brake",
    "ArtistName": "Tycho"
  },
  {
    "Name": "Hoppípolla - EcoConsciousness",
    "AlbumName": "Takk...",
    "ArtistName": "Sigur Rós"
  },
  {
    "Name": "Destiny",
    "AlbumName": "Simple Things",
    "ArtistName": "Zero 7"
  },
  {
    "Name": "Wait So Long",
    "AlbumName": "Palomino",
    "ArtistName": "Trampled by Turtles"
  },
  {
    "Name": "Psychological Counterpoint",
    "AlbumName": "Modal Soul",
    "ArtistName": "Nujabes"
  },
  {
    "Name": "Drown",
    "AlbumName": "The Smashing Pumpkins",
    "ArtistName": "Singles - Soundtrack"
  },
  {
    "Name": "Sex And Candy",
    "AlbumName": "Big Shiny 90s",
    "ArtistName": "Marcy Playground"
  },
  {
    "Name": "No Static",
    "AlbumName": "The Humdinger",
    "ArtistName": "Nappy Roots"
  },
  {
    "Name": "1234",
    "AlbumName": "2008 Grammy Nominees (2008)",
    "ArtistName": "Feist"
  },
  {
    "Name": "Livingston Storm",
    "AlbumName": "Nomad",
    "ArtistName": "Lotus"
  },
  {
    "Name": "Chameleon",
    "AlbumName": "Head Hunters",
    "ArtistName": "Herbie Hancock"
  },
  {
    "Name": "Black Sands",
    "AlbumName": "Black sands",
    "ArtistName": "Bonobo"
  },
  {
    "Name": "Feel It All Around",
    "AlbumName": "Life of Leisure",
    "ArtistName": "Washed Out"
  },
  {
    "Name": "Slow Motion",
    "AlbumName": "Blue",
    "ArtistName": "Third Eye Blind"
  },
  {
    "Name": "Sweater Weather",
    "AlbumName": "I'm Sorry",
    "ArtistName": "The Neighbourhood"
  },
  {
    "Name": "Truckdrivin' Neighbors",
    "AlbumName": "Mellow Gold",
    "ArtistName": "Beck"
  },
  {
    "Name": "Envoi",
    "AlbumName": "Absynthe Minded",
    "ArtistName": "Absynthe Minded"
  },
  {
    "Name": "Marisol",
    "AlbumName": "Oil On Glass / Feather On Wood",
    "ArtistName": "Lotus"
  },
  {
    "Name": "Grayrigg",
    "AlbumName": "Oil On Glass / Feather On Wood",
    "ArtistName": "Lotus"
  },
  {
    "Name": "Now A Daze",
    "AlbumName": "The Old Prince",
    "ArtistName": "Shad"
  },
  {
    "Name": "Cult Logic",
    "AlbumName": "Miike Snow",
    "ArtistName": "Miike Snow"
  },
  {
    "Name": "Never Never",
    "AlbumName": "SBTRKT",
    "ArtistName": "SBTRKT"
  },
  {
    "Name": "Ocean Man",
    "AlbumName": "The Mollusk",
    "ArtistName": "Ween"
  },
  {
    "Name": "Gold In Gold Out",
    "AlbumName": "Noir",
    "ArtistName": "Blue Sky Black Death"
  },
  {
    "Name": "Crystalfilm",
    "AlbumName": "Ritual Union",
    "ArtistName": "Little Dragon"
  }
]

},{}],7:[function(require,module,exports){
(function() {
  var Base, Items, Panes, Ranger, items, panes;

  Base = require('base');

  Ranger = require('./controllers/ranger.coffee');

  Panes = require('./controllers/panes.coffee');

  Items = require('./controllers/items.coffee');

  window.vent = new Base.Event();

  window.templates = {
    pane: require('./views/pane.coffee'),
    item: require('./views/item.coffee')
  };

  window.ranger = new Ranger({
    el: $('.ranger')
  });

  items = require('./data.json');

  panes = [['Artists', 'ArtistName'], ['Albums', 'AlbumName'], ['Songs', 'Name']];

  document.onkeydown = function(e) {
    var _ref;
    switch (e.which) {
      case 38:
        ranger.up();
        break;
      case 37:
        ranger.left();
        break;
      case 39:
        ranger.right();
        break;
      case 40:
        ranger.down();
    }
    if ((37 <= (_ref = e.which) && _ref <= 40)) {
      e.preventDefault();
      return false;
    }
  };

  ranger.loadRaw(items, panes);

}).call(this);


},{"./controllers/items.coffee":3,"./controllers/panes.coffee":4,"./controllers/ranger.coffee":5,"./data.json":6,"./views/item.coffee":10,"./views/pane.coffee":11,"base":1}],8:[function(require,module,exports){
(function() {
  var Base, Item, Items, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Base = require('base');

  Item = (function(_super) {
    __extends(Item, _super);

    Item.prototype.defaults = {
      name: '',
      child: false
    };

    function Item(attrs) {
      var Pane;
      Item.__super__.constructor.apply(this, arguments);
      if (attrs.child == null) {
        return;
      }
      Pane = require('../models/pane.coffee').prototype.model;
      this.child = new Pane(attrs.child);
      this.child.parent = this;
    }

    return Item;

  })(Base.Model);

  Items = (function(_super) {
    __extends(Items, _super);

    function Items() {
      _ref = Items.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Items.prototype.model = Item;

    return Items;

  })(Base.Collection);

  module.exports = Items;

}).call(this);


},{"../models/pane.coffee":9,"base":1}],9:[function(require,module,exports){
(function() {
  var Base, Item, Pane, Panes, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Base = require('base');

  Item = require('../models/item.coffee');

  Pane = (function(_super) {
    __extends(Pane, _super);

    Pane.prototype.defaults = {
      title: '',
      contents: []
    };

    function Pane(attrs) {
      Pane.__super__.constructor.apply(this, arguments);
      this.contents = new Item();
      this.contents.refresh(attrs.contents, true);
    }

    return Pane;

  })(Base.Model);

  Panes = (function(_super) {
    __extends(Panes, _super);

    function Panes() {
      _ref = Panes.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Panes.prototype.model = Pane;

    return Panes;

  })(Base.Collection);

  module.exports = Panes;

}).call(this);


},{"../models/item.coffee":8,"base":1}],10:[function(require,module,exports){
(function() {
  var Base, template;

  Base = require('base');

  template = "{{ name }}";

  module.exports = new Base.View(template, true);

}).call(this);


},{"base":1}],11:[function(require,module,exports){
(function() {
  var Base, template;

  Base = require('base');

  template = "<div class=\"title\">{{ title }}</div>\n<div class=\"items\"></div>";

  module.exports = new Base.View(template, true);

}).call(this);


},{"base":1}]},{},[7])
;