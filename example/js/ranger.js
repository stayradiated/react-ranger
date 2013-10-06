(function() {
  (function(files) {
    var cache, module, req;
    cache = {};
    req = function(id) {
      var file;
      if (cache[id] == null) {
        if (files[id] == null) {
          if ((typeof require !== "undefined" && require !== null)) {
            return require(id);
          }
          console.log("Cannot find module '" + id + "'");
          return null;
        }
        file = cache[id] = {
          exports: {}
        };
        files[id][1].call(file.exports, (function(name) {
          var realId;
          realId = files[id][0][name];
          return req(realId != null ? realId : name);
        }), file, file.exports);
      }
      return cache[id].exports;
    };
    if (typeof module === 'undefined') {
      module = {};
    }
    return module.exports = req(0);
  })([
    [
      {
        /*
          /Users/Admin/Projects/Ranger/lib/controllers/ranger.js
        */

        'base': 1,
        '../common': 2,
        '../views/pane': 3,
        '../views/item': 4,
        '../controllers/panes': 5,
        '../controllers/items': 6,
        '../models/pane': 7,
        '../models/item': 8
      }, function(require, module, exports) {
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
      ;
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Ranger/node_modules/base/index.js
        */

      }, function(require, module, exports) {
        /*jslint node: true, nomen: true*/
      
      (function () {
          "use strict";
      
          var include, extend, inherit, Controller, Event, Model, Collection;
      
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
      
              Controller.prototype.unbind = function (el) {
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
                          self.trigger('change', key, value);
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
                  if (replace) {
                      this._data = {};
                      include(this._data, this.defaults);
                  }
                  include(this._data, data);
                  this.trigger('refresh');
                  return this;
              };
      
              // Destroy the model
              Model.prototype.destroy = function () {
                  this.trigger('before:destroy');
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
                  model.on('change', function (key, value) {
                      self.trigger('change:model', model, key, value);
                  });
      
                  // Bubble destroy event
                  model.on('before:destroy', function () {
                      self.trigger('before:destroy:model', model);
                  });
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
              Collection.prototype.indexOf = function () {
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
      
          // Add the extend to method to all classes
          Event.extend = Controller.extend = Model.extend = Collection.extend = extend;
      
          // Export all the classes
          module.exports = {
              Event: Event,
              Controller: Controller,
              Model: Model,
              Collection: Collection
          };
      
      }());
      ;
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Ranger/lib/common.js
        */

      }, function(require, module, exports) {
        (function () {
      
          'use strict';
      
          module.exports = {
              bind: function (fn, me) {
                  return function () {
                      return fn.apply(me, arguments);
                  };
              }
          };
      
      }());
      ;
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Ranger/lib/views/pane.js
        */

      }, function(require, module, exports) {
        (function () {
      
          'use strict';
      
          module.exports = function (obj) {
              return '<div class=\"title\">' + obj.title + '</div><div class="items"></div>';
          };
      
      }());
      ;
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Ranger/lib/views/item.js
        */

      }, function(require, module, exports) {
        (function () {
      
          'use strict';
      
          module.exports = function (obj) {
              return obj.title;
          };
      
      }());
      ;
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Ranger/lib/controllers/panes.js
        */

        'base': 1,
        '../controllers/items': 6,
        '../common': 2
      }, function(require, module, exports) {
        /*jslint browser: true, node: true, nomen: true*/
      /*global $*/
      
      (function () {
      
          'use strict';
      
          var Base, Items, bind, Panes, template, vent, SCROLL_OFFSET, SCROLL_HEIGHT;
      
          Base  = require('base');
          Items = require('../controllers/items')();
          bind  = require('../common').bind;
      
          // Constants
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
                  var item, offset, parent, height, pos, scroll;
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
      ;
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Ranger/lib/controllers/items.js
        */

        'base': 1,
        '../common': 2
      }, function(require, module, exports) {
        /*jslint browser: true, node: true, nomen: true*/
      /*global $*/
      
      (function () {
      
          'use strict';
      
          var Base, Items, template, vent, bind;
      
          Base = require('base');
          bind = require('../common').bind;
      
          // Set globals
          module.exports = function (vnt, tmpl) {
              if (vent === undefined) { vent = vnt; }
              if (template === undefined) { template = tmpl; }
              window.TEMPLATE = template;
              return Items;
          };
      
          Items = Base.Controller.extend({
      
              tagName: 'div',
              className: 'item',
      
              events: {
                  'mousedown': 'click'
              },
      
              constructor: function () {
      
                  this.select = bind(this.select, this);
                  this.click  = bind(this.click, this);
                  this.remove = bind(this.remove, this);
                  this.render = bind(this.render, this);
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
      
              },
      
              render: function () {
                  this.el.html(template(this.item.toJSON()));
                  return this;
              },
      
              remove: function () {
                  this.unbind();
                  this.el.remove();
                  delete this.el;
                  this.unlisten();
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
      ;
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Ranger/lib/models/pane.js
        */

        'base': 1,
        '../models/item': 8
      }, function(require, module, exports) {
        /*jslint browser: true, node: true, nomen: true*/
      
      (function () {
      
          'use strict';
      
          var Base, Item, Pane, Panes;
      
          Base = require('base');
          Item = require('../models/item');
      
          Pane = Base.Model.extend({
      
              defaults: {
                  title: '',
                  contents: []
              },
      
              constructor: function (attrs) {
                  Pane.__super__.constructor.apply(this, arguments);
                  this.contents = new Item();
                  this.contents.refresh(attrs.contents, true);
              }
      
          });
      
          Panes = Base.Collection.extend({
      
              constructor: function () {
                  return Panes.__super__.constructor.apply(this, arguments);
              },
      
              model: Pane
      
          });
      
          module.exports = Panes;
      
      }());
      ;
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Ranger/lib/models/item.js
        */

        'base': 1,
        '../models/pane': 7
      }, function(require, module, exports) {
        /*jslint browser: true, node: true, nomen: true*/
      
      (function () {
      
          'use strict';
      
          var Base, Item, Items;
      
          Base = require('base');
      
          // Item Model
          Item = Base.Model.extend({
      
              defaults: {
                  title: '',
                  child: false,
                  data: false
              },
      
              constructor: function (attrs) {
                  var Pane;
                  Item.__super__.constructor.apply(this, arguments);
                  if (attrs.child === undefined) {
                      return;
                  }
                  Pane = require('../models/pane').prototype.model;
                  this.child = new Pane(attrs.child);
                  this.child.parent = this;
              }
      
          });
      
      
          // Item Collection
          Items = Base.Collection.extend({
      
              constructor: function () {
                  return Items.__super__.constructor.apply(this, arguments);
              },
      
              model: Item
      
          });
      
          module.exports = Items;
      
      }());
      ;
      }
    ]
  ]);

}).call(this);
